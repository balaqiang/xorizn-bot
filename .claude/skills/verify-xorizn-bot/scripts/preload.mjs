// Loaded into the bot process with `node --import <this file> src/index.js --no-connect` by up.mjs.
// It never touches WhatsApp: once src/index.js finishes booting, it installs a recording fake socket
// as bot.sock (the transport boundary) and opens a control server on 127.0.0.1:$VERIFY_CONTROL_PORT
// that feeds synthetic incoming messages into the real handler (src/core/handler.js).
import fs from 'node:fs'
import path from 'node:path'
import http from 'node:http'
import crypto from 'node:crypto'
import { EventEmitter } from 'node:events'
import { pathToFileURL } from 'node:url'
import { FIXTURE } from './lib.mjs'

const APP = process.env.VERIFY_APP_DIR
const CONTROL_PORT = Number(process.env.VERIFY_CONTROL_PORT)
const MEDIA_DIR = path.join(process.env.VERIFY_EVIDENCE_DIR, 'media')
const appModule = (rel) => import(pathToFileURL(path.join(APP, rel)).href)

const { default: bot } = await appModule('src/core/bot.js')
const { default: logger } = await appModule('src/core/logger.js')

const jidOf = (n) => `${n}@s.whatsapp.net`
const BOT_JID = jidOf(FIXTURE.botNumber)

// ---------- fixture groups (what groupMetadata / groupFetchAllParticipating return) ----------
const groups = new Map()
function putGroup({ id = FIXTURE.group, subject = 'Verify Group', participants } = {}) {
  const list = participants || [
    { number: FIXTURE.botNumber, admin: 'admin' },
    { number: FIXTURE.admin, admin: 'admin' },
    { number: FIXTURE.owner, admin: null },
    { number: FIXTURE.user, admin: null }
  ]
  const meta = {
    id,
    subject,
    owner: jidOf(FIXTURE.admin),
    creation: Math.floor(Date.now() / 1000) - 86_400,
    desc: 'fixture group for verification',
    announce: false,
    restrict: false,
    size: list.length,
    participants: list.map((p) => ({ id: jidOf(p.number), phoneNumber: jidOf(p.number), admin: p.admin || null }))
  }
  groups.set(id, meta)
  return meta
}
putGroup()

// ---------- recording ----------
const calls = []
let seq = 0
fs.mkdirSync(MEDIA_DIR, { recursive: true })

function sniffExt(buf) {
  const h = buf.subarray(0, 12)
  const hex = h.toString('hex')
  if (hex.startsWith('89504e47')) return 'png'
  if (hex.startsWith('ffd8ff')) return 'jpg'
  if (h.toString('latin1', 0, 4) === 'RIFF' && h.toString('latin1', 8, 12) === 'WEBP') return 'webp'
  if (h.toString('latin1', 0, 4) === 'GIF8') return 'gif'
  if (h.toString('latin1', 0, 4) === 'OggS') return 'ogg'
  if (h.toString('latin1', 4, 8) === 'ftyp') return 'mp4'
  if (h.toString('latin1', 0, 4) === '%PDF') return 'pdf'
  if (h.toString('latin1', 0, 3) === 'ID3' || hex.startsWith('fffb')) return 'mp3'
  return 'bin'
}

function sanitize(v, s, key = 'v', depth = 0) {
  if (Buffer.isBuffer(v) || v instanceof Uint8Array) {
    const buf = Buffer.from(v)
    const file = `${String(s).padStart(4, '0')}-${key}.${sniffExt(buf)}`
    fs.writeFileSync(path.join(MEDIA_DIR, file), buf)
    return { $media: `media/${file}`, bytes: buf.length }
  }
  if (typeof v === 'function') return '[function]'
  if (typeof v === 'bigint') return String(v)
  if (!v || typeof v !== 'object') return v
  if (depth > 6) return '[depth]'
  if (typeof v.pipe === 'function') return '[stream]'
  if (Array.isArray(v)) return v.slice(0, 50).map((x, i) => sanitize(x, s, `${key}${i}`, depth + 1))
  const out = {}
  for (const [k, x] of Object.entries(v)) {
    if (k === 'quoted') out[k] = { id: x?.key?.id || null }
    else out[k] = sanitize(x, s, k, depth + 1)
  }
  return out
}

function summarize(method, args) {
  if (method !== 'sendMessage') return method
  const c = args[1] || {}
  if (c.react) return `react ${c.react.text}`
  if (c.delete) return 'delete'
  if (c.edit) return `edit: ${c.text ?? c.caption ?? ''}`
  for (const k of ['image', 'video', 'audio', 'sticker', 'document']) if (c[k]) return `${k}${c.caption ? `: ${c.caption}` : ''}`
  if (c.text !== undefined) return `text: ${c.text}`
  return `content keys: ${Object.keys(c).join(',')}`
}

function record(method, args) {
  const s = ++seq
  const entry = { seq: s, at: Date.now(), method, jid: typeof args[0] === 'string' ? args[0] : null, summary: summarize(method, args), args: sanitize(args, s) }
  calls.push(entry)
  if (calls.length > 5000) calls.shift()
  return entry
}

// ---------- fake socket ----------
let msgN = 0
const user = { id: `${FIXTURE.botNumber}:1@s.whatsapp.net`, lid: '', name: 'xorizn-verify' }
const target = {
  user,
  type: 'md',
  ev: new EventEmitter(),
  ws: { on() {}, off() {}, close() {}, isOpen: true, readyState: 1 },
  authState: { creds: { registered: true, me: user }, keys: {} },
  signalRepository: { lidMapping: { getPNForLID: async () => null, getLIDForPN: async () => null } },
  async sendMessage(jid, content = {}, options = {}) {
    record('sendMessage', [jid, content, options])
    return { key: { remoteJid: jid, fromMe: true, id: `VERIFYOUT${++msgN}` }, message: { conversation: content.text || '' }, messageTimestamp: Math.floor(Date.now() / 1000), status: 1 }
  },
  async relayMessage(jid, message, opts = {}) {
    record('relayMessage', [jid, message, opts])
    return opts.messageId || `VERIFYOUT${++msgN}`
  },
  async groupMetadata(jid) {
    record('groupMetadata', [jid])
    const g = groups.get(jid)
    if (!g) throw Object.assign(new Error('item-not-found'), { output: { statusCode: 404 } })
    return structuredClone(g)
  },
  async groupFetchAllParticipating() {
    record('groupFetchAllParticipating', [])
    return Object.fromEntries([...groups].map(([k, v]) => [k, structuredClone(v)]))
  },
  async profilePictureUrl(jid) {
    record('profilePictureUrl', [jid])
    throw Object.assign(new Error('item-not-found'), { output: { statusCode: 404 } })
  },
  async onWhatsApp(...jids) {
    record('onWhatsApp', jids)
    return jids.flat().map((j) => ({ exists: true, jid: String(j).includes('@') ? j : jidOf(String(j).replace(/\D/g, '')) }))
  },
  async updateMediaMessage(m) {
    return m
  },
  decodeJid: (jid) => (jid ? String(jid).replace(/:\d+@/, '@') : jid),
  end() {},
  async logout() {
    record('logout', [])
  }
}
const sock = new Proxy(target, {
  get(t, p) {
    if (p in t) return t[p]
    if (typeof p === 'symbol' || p === 'then' || p === 'toJSON') return undefined
    // Any other socket method (readMessages, sendPresenceUpdate, groupParticipantsUpdate, ...) is recorded and resolves.
    return (...args) => {
      record(String(p), args)
      return Promise.resolve(undefined)
    }
  },
  set(t, p, v) {
    t[p] = v
    return true
  }
})

// ---------- boot detection ----------
let ready = false
let bootError = null
const logTap = []
logger.on('entry', (e) => {
  logTap.push(e)
  if (logTap.length > 2000) logTap.shift()
  if (!ready && e.scope === 'main' && e.message.includes('--no-connect')) onBooted().catch((err) => (bootError = String(err?.stack || err)))
  if (e.scope === 'main' && e.message.startsWith('gagal start')) bootError = e.message
})

async function onBooted() {
  bot.sock = sock
  global.conn = global.mainSock = sock
  bot.setStatus({ connection: 'open', qr: null, pairingCode: null, me: { id: BOT_JID, lid: '', name: user.name } })
  // Same steps connection.js runs on connection === 'open'.
  for (const pack of Object.values(bot.packs)) await Promise.resolve(pack.onOpen?.(sock)).catch((e) => logger.log('error', 'verify', `onOpen ${pack.name}: ${e.message}`))
  for (const hook of bot.nativeHooks || []) if (hook.onOpen) await Promise.resolve(hook.onOpen(sock, bot)).catch((e) => logger.log('error', 'verify', `onOpen ${hook.file}: ${e.message}`))
  const { refreshGroups } = await appModule('src/core/connection.js')
  await refreshGroups(true)
  ready = true
  logger.log('success', 'verify', `fake socket installed, control on 127.0.0.1:${CONTROL_PORT}`)
}

// ---------- control server ----------
const readBody = (req) =>
  new Promise((resolve, reject) => {
    let d = ''
    req.on('data', (c) => (d += c))
    req.on('end', () => {
      try {
        resolve(d ? JSON.parse(d) : {})
      } catch (err) {
        reject(err)
      }
    })
  })

function rawMessage(b) {
  const from = String(b.from || FIXTURE.user).replace(/\D/g, '')
  const groupJid = b.group === true ? FIXTURE.group : b.group || null
  const chat = groupJid || jidOf(from)
  const id = `VERIFYIN${crypto.randomBytes(6).toString('hex').toUpperCase()}`
  let message = b.message
  if (!message) {
    if (b.quotedText !== undefined) {
      message = {
        extendedTextMessage: {
          text: String(b.text ?? ''),
          contextInfo: { stanzaId: `VERIFYQ${crypto.randomBytes(4).toString('hex').toUpperCase()}`, participant: b.quotedFrom ? jidOf(b.quotedFrom) : BOT_JID, quotedMessage: { conversation: String(b.quotedText) } }
        }
      }
    } else message = { conversation: String(b.text ?? '') }
  }
  return {
    key: { remoteJid: chat, fromMe: !!b.fromMe, id, ...(groupJid ? { participant: jidOf(from) } : {}) },
    message,
    messageTimestamp: Math.floor(Date.now() / 1000),
    pushName: b.name || 'Verifier'
  }
}

// Non-owner senders have a per-user cooldown (settings.cooldown, default 2 s) and commands inside it are
// dropped silently. Space messages from the same sender like a human would, unless b.noPace (to test cooldown).
const lastBySender = new Map()

async function chat(b) {
  const { onMessagesUpsert } = await appModule('src/core/handler.js')
  const raw = rawMessage(b)
  const sender = String(b.from || FIXTURE.user)
  const gap = (Number(bot.settings?.cooldown ?? 2) + 0.2) * 1000 - (Date.now() - (lastBySender.get(sender) || 0))
  if (!b.noPace && gap > 0) await new Promise((r) => setTimeout(r, gap))
  lastBySender.set(sender, Date.now())
  const startSeq = seq
  const startAt = Date.now()
  const waitMs = Number(b.waitMs) || 20_000
  const idleMs = Number(b.idleMs) || 1500
  let commandEvent = null
  const onCmd = (c) => (commandEvent = c)
  bot.on('command', onCmd)
  try {
    await onMessagesUpsert({ messages: [raw], type: 'notify' })
    // Plugins may keep sending after the handler returns; wait until the socket goes quiet.
    let last = seq
    let quietSince = Date.now()
    while (Date.now() - startAt < waitMs) {
      await new Promise((r) => setTimeout(r, 100))
      if (seq !== last) {
        last = seq
        quietSince = Date.now()
      } else if (Date.now() - quietSince >= idleMs) break
    }
  } finally {
    bot.off('command', onCmd)
  }
  return {
    input: { chat: raw.key.remoteJid, from: b.from || FIXTURE.user, text: b.text ?? null, id: raw.key.id },
    command: commandEvent,
    replies: calls.filter((c) => c.seq > startSeq),
    logs: logTap.filter((e) => e.time >= startAt).map((e) => `${e.level} [${e.scope}] ${e.message}`),
    ms: Date.now() - startAt
  }
}

const routes = {
  'GET /health': async () => ({ ready, bootError, pid: process.pid, app: APP, connection: bot.status?.connection, commands: bot.registry?.active().length ?? 0, packs: Object.keys(bot.packs || {}), callCount: seq }),
  'POST /chat': async (b) => chat(b),
  'GET /calls': async (b, url) => calls.filter((c) => c.seq > Number(url.searchParams.get('since') || 0)),
  'GET /db': async (b, url) => {
    const c = url.searchParams.get('collection')
    const id = url.searchParams.get('id')
    return id ? bot.db.get(c, id) ?? null : bot.db.collection(c)
  },
  'POST /flush': async () => {
    await bot.db.flush()
    return { ok: true }
  },
  'POST /group': async (b) => {
    const meta = putGroup(b)
    await bot.groupCache.get(sock, meta.id, true)
    return meta
  },
  'POST /shutdown': async () => {
    setTimeout(() => process.exit(0), 50) // routed through lifecycle.js → database saved first
    return { ok: true }
  }
}

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x')
    const fn = routes[`${req.method} ${url.pathname}`]
    res.setHeader('content-type', 'application/json')
    if (!fn) return res.writeHead(404).end(JSON.stringify({ error: 'unknown route' }))
    if (!ready && url.pathname !== '/health' && url.pathname !== '/shutdown') return res.writeHead(503).end(JSON.stringify({ error: 'bot not booted yet', bootError }))
    try {
      const body = req.method === 'GET' ? {} : await readBody(req)
      res.end(JSON.stringify(await fn(body, url)))
    } catch (err) {
      res.writeHead(500).end(JSON.stringify({ error: String(err?.stack || err) }))
    }
  })
  .listen(CONTROL_PORT, '127.0.0.1')
