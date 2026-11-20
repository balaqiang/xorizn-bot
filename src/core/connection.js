/**
 * Koneksi WhatsApp (Baileys v7): auth multi-file, login pairing code / QR, reconnect otomatis.
 */
import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import makeWASocket, {
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
  DisconnectReason,
  Browsers,
  isJidNewsletter,
  isJidBroadcast,
  jidNormalizedUser
} from 'baileys'
import QRCode from 'qrcode'
import bot from './bot.js'
import logger, { baileysLogger } from '../logger.js'
import { SimpleCache } from './cache.js'
import { onMessagesUpsert } from './handler.js'
import { onGroupParticipants } from '../features/greetings.js'
import { getGroup } from './models.js'
import { digits } from './jid.js'

const log = logger.child('wa')
const retryCache = new SimpleCache()
let reconnectTimer = null
let attempts = 0
let pairingRequested = false
let askedConsole = false
let lastPairNumber = ''
let stopping = false

async function waVersion() {
  try {
    const res = await Promise.race([
      fetchLatestBaileysVersion(),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 8000))
    ])
    return res.version
  } catch (err) {
    log.warn('gagal mengambil versi WhatsApp terbaru, memakai versi bawaan Baileys:', err.message)
    return undefined
  }
}

function askConsole(question) {
  if (!process.stdin.isTTY) return Promise.resolve('')
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => rl.question(question, (a) => { rl.close(); resolve(a) }))
}

/** Minta pairing code untuk nomor tertentu (dipanggil otomatis atau dari dashboard). */
export async function requestPairing(number) {
  const sock = bot.sock
  const phone = digits(number)
  if (!sock) throw new Error('Socket belum siap')
  if (sock.authState.creds.registered) throw new Error('Bot sudah login')
  if (phone.length < 8) throw new Error('Nomor tidak valid (pakai kode negara, contoh 628xxx)')
  const code = await sock.requestPairingCode(phone)
  const pretty = code?.match(/.{1,4}/g)?.join('-') || code
  pairingRequested = true
  lastPairNumber = phone
  bot.setStatus({ connection: 'pairing', pairingCode: pretty, qr: null, pairingNumber: phone })
  log.success(`PAIRING CODE untuk ${phone}: ${pretty}`)
  log.info('Buka WhatsApp → Perangkat tertaut → Tautkan perangkat → Tautkan dengan nomor telepon, lalu masukkan kode di atas.')
  return pretty
}

/** Wrap pengiriman untuk mencatat id pesan buatan bot (agar tidak diproses ulang sebagai perintah). */
function trackSends(sock) {
  bot.sentIds = bot.sentIds || new Set()
  const remember = (id) => {
    if (!id) return
    bot.sentIds.add(id)
    if (bot.sentIds.size > 5000) bot.sentIds.delete(bot.sentIds.values().next().value)
  }
  const send = sock.sendMessage
  sock.sendMessage = async (...args) => {
    const res = await send(...args)
    remember(res?.key?.id)
    return res
  }
  const relay = sock.relayMessage
  sock.relayMessage = async (jid, message, opts = {}) => {
    const id = await relay(jid, message, opts)
    remember(opts.messageId || id)
    return id
  }
}

export async function connect() {
  stopping = false
  const { config } = bot
  fs.mkdirSync(config.paths.session, { recursive: true })
  const { state, saveCreds } = await useMultiFileAuthState(config.paths.session)
  const version = await waVersion()
  const blog = baileysLogger()

  const sock = makeWASocket({
    ...(version ? { version } : {}),
    logger: blog,
    auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, blog) },
    browser: Browsers.ubuntu('Chrome'),
    markOnlineOnConnect: !!bot.settings.alwaysOnline,
    syncFullHistory: false,
    generateHighQualityLinkPreview: false,
    msgRetryCounterCache: retryCache,
    getMessage: async (key) => bot.messageStore.getMessage(key),
    cachedGroupMetadata: async (jid) => bot.groupCache.peek(jid),
    shouldIgnoreJid: (jid) => isJidNewsletter(jid) || (isJidBroadcast(jid) && jid !== 'status@broadcast')
  })
  trackSends(sock)
  bot.sock = sock
  global.conn = global.mainSock = sock
  bot.setStatus({ connection: 'connecting', qr: null, pairingCode: null })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr && !sock.authState.creds.registered) {
      const method = config.bot.loginMethod || 'pairing'
      if (method === 'qr') {
        const dataUrl = await QRCode.toDataURL(qr, { margin: 1, width: 320 })
        bot.setStatus({ connection: 'qr', qr: dataUrl, pairingCode: null })
        const term = await QRCode.toString(qr, { type: 'terminal', small: true })
        log.info('Scan QR berikut (atau buka dashboard):\n' + term)
      } else if (!pairingRequested) {
        let number = config.bot.pairingNumber || lastPairNumber
        if (!digits(number) && bot.status.connection !== 'pairing') {
          bot.setStatus({ connection: 'pairing', pairingCode: null, qr: null })
          log.warn(`Belum login. Masukkan nomor bot di dashboard (http://${config.dashboard.host}:${config.dashboard.port}) atau di console.`)
          if (!askedConsole) {
            askedConsole = true
            number = await askConsole('Nomor WhatsApp bot (contoh 628xxx, kosongkan untuk lewat dashboard): ')
          }
        }
        if (digits(number) && !pairingRequested) {
          try {
            await requestPairing(number)
          } catch (err) {
            log.error('gagal meminta pairing code:', err.message)
          }
        }
      }
    }

    if (connection === 'open') {
      attempts = 0
      pairingRequested = false
      const me = { id: jidNormalizedUser(sock.user?.id), lid: sock.user?.lid ? jidNormalizedUser(sock.user.lid) : '', name: sock.user?.name || sock.user?.notify || '' }
      bot.setStatus({ connection: 'open', qr: null, pairingCode: null, me })
      log.success(`terhubung sebagai ${me.name || ''} (${me.id})`)
      refreshGroups(true).catch((err) => log.warn('gagal memuat daftar grup:', err.message))
      for (const pack of Object.values(bot.packs)) pack.onOpen?.(sock)?.catch?.((e) => log.error(`onOpen ${pack.name}:`, e.message))
      for (const hook of bot.nativeHooks || []) if (hook.onOpen) Promise.resolve(hook.onOpen(sock, bot)).catch((e) => log.error(`onOpen ${hook.file}:`, e.message))
    }

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode
      const reason = lastDisconnect?.error?.message || ''
      bot.setStatus({ connection: 'close', lastDisconnect: { code, reason, at: Date.now() }, pairingCode: null })
      if (!sock.authState.creds.registered) pairingRequested = false
      if (stopping) return
      if (code === DisconnectReason.loggedOut || code === DisconnectReason.forbidden) {
        log.error('Sesi logout dari HP. Menyimpan cadangan sesi lama dan menyiapkan login ulang...')
        backupSession()
        bot.setStatus({ connection: 'logged_out', me: null })
        pairingRequested = false
        schedule(3000)
        return
      }
      if (code === DisconnectReason.connectionReplaced) {
        log.error('Koneksi diganti oleh sesi lain (bot dijalankan di 2 tempat?). Tidak menyambung ulang otomatis.')
        return
      }
      const delay = code === DisconnectReason.restartRequired ? 500 : Math.min(30_000, 2000 * 2 ** attempts++)
      log.warn(`koneksi terputus (${code || '-'} ${reason}). Menyambung ulang dalam ${Math.round(delay / 1000)} dtk...`)
      schedule(delay)
    }
  })

  sock.ev.on('messages.upsert', (ev) => onMessagesUpsert(ev))

  sock.ev.on('group-participants.update', async (ev) => {
    try {
      await onGroupParticipants(sock, ev)
    } catch (err) {
      log.error('group-participants:', err.message)
    }
    for (const pack of Object.values(bot.packs)) {
      try {
        await pack.onParticipants?.(sock, ev)
      } catch (err) {
        log.error(`onParticipants ${pack.name}:`, err.message)
      }
    }
    for (const hook of bot.nativeHooks || []) if (hook.onParticipants) Promise.resolve(hook.onParticipants(sock, ev, bot)).catch(() => {})
    bot.emit('groups')
  })

  sock.ev.on('groups.update', async (updates) => {
    for (const u of updates) {
      if (!u.id) continue
      const meta = await bot.groupCache.get(sock, u.id, true).catch(() => null)
      if (meta?.subject) getGroup(u.id).name = meta.subject
    }
    bot.emit('groups')
  })
  sock.ev.on('groups.upsert', (list) => {
    for (const meta of list) {
      bot.groupCache.set(meta.id, meta)
      const g = getGroup(meta.id)
      g.name = meta.subject || g.name
      if (!g.joinedAt) g.joinedAt = Date.now()
    }
    bot.emit('groups')
  })

  sock.ev.on('call', async (calls) => {
    if (!bot.settings.antiCall) return
    for (const call of calls) {
      if (call.status !== 'offer') continue
      try {
        await sock.rejectCall(call.id, call.from)
        await sock.sendMessage(call.from, { text: bot.settings.antiCallMessage })
        log.info(`panggilan dari ${call.from} ditolak otomatis`)
      } catch {}
    }
  })

  return sock
}

function schedule(ms) {
  clearTimeout(reconnectTimer)
  reconnectTimer = setTimeout(() => connect().catch((err) => {
    log.error('gagal menyambung:', err.message)
    schedule(10_000)
  }), ms)
}

function backupSession() {
  const dir = bot.config.paths.session
  if (!fs.existsSync(dir)) return
  const dest = path.join(bot.config.paths.data, 'session-backup', `session-${Date.now()}`)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  try {
    fs.renameSync(dir, dest)
  } catch {
    fs.cpSync(dir, dest, { recursive: true })
    fs.rmSync(dir, { recursive: true, force: true })
  }
}

/** Ambil ulang semua grup yang diikuti dan sinkronkan nama ke database. */
export async function refreshGroups(force = false) {
  if (!bot.sock || !bot.isConnected) return []
  const list = await bot.groupCache.all(bot.sock, force)
  for (const meta of list) {
    const g = getGroup(meta.id)
    g.name = meta.subject || g.name
  }
  bot.db.save()
  bot.emit('groups')
  return list
}

/** Logout & hapus sesi (dari dashboard). */
export async function logout() {
  stopping = true
  try {
    await bot.sock?.logout()
  } catch {}
  backupSession()
  bot.setStatus({ connection: 'logged_out', me: null, qr: null, pairingCode: null })
  pairingRequested = false
  schedule(1500)
}

export async function restartSocket() {
  stopping = true
  try {
    bot.sock?.end(new Error('restart'))
  } catch {}
  pairingRequested = false
  schedule(1000)
}
