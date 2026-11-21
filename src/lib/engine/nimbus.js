// lib/xorizn.js — adapter plugin gaya "xorizn-bot" (ESM: export { pluginConfig as config, handler }) untuk bot xorizn-bot (CJS).
// Kode plugin asli TIDAK diubah: tersimpan utuh di engine/plugins/<kategori>/<nama>.js dan dimuat lewat import() saat dipakai.
// Yang dilakukan adapter ini:
//   • plugin(rel, meta)  -> objek plugin xorizn-bot { name, command, category, run, ... } (stub di plugins/xorizn/**)
//   • m bergaya xorizn-bot    -> m.reply / m.react / m.prefix / m.command / m.args / m.text / m.quoted / m.download / m.isImage ...
//   • sock tambahan      -> sendMedia, sendButton, sendStickerPack, sendCodeBlock, getName, albumMessage
//   • pengaman           -> private / premium / cooldown / energi(limit) / apikey / scraper / aset yang belum ada
'use strict'

const fs = require('fs')
const path = require('path')
const { pathToFileURL } = require('url')
const baileys = require('@whiskeysockets/baileys')
const mime = require('mime-types')
const { AsyncLocalStorage } = require('async_hooks')
const S = require('./core')
const config = require('../../config')
const limit = require('../limit')
const ztowner = require('./pulse-owner')

const ROOT = path.join(__dirname, '..', '..', 'engine', 'nimbus')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const MEDIA_RE = /^(image|video|audio|sticker|document)Message$/


// ---------------------------------------------------------------- diagnosa error (plugin asli menelan error di catch -> kita catat)
const als = new AsyncLocalStorage()
global.xoriznErrors = global.xoriznErrors || []
globalThis.__xoriznCatch = (e) => {
  const st = als.getStore()
  const stack = String((e && e.stack) || '').split('\n').slice(1, 3).map((x) => x.trim()).join(' | ')
  const rec = { t: Date.now(), cmd: st ? st.cmd : '-', msg: String((e && e.message) || e).slice(0, 300), at: stack.slice(0, 200) }
  global.xoriznErrors.push(rec)
  if (global.xoriznErrors.length > 40) global.xoriznErrors.shift()
  if (st) st.errs.push(rec)
  console.log(`[XORIZN:${rec.cmd}] ${rec.msg}${rec.at ? '  @ ' + rec.at : ''}`)
}

// ---------------------------------------------------------------- muat modul ESM (di-cache, gagal tidak di-cache)
const cache = new Map()
function loadModule(file) {
  if (!cache.has(file)) {
    const p = import(pathToFileURL(file).href)
    p.catch(() => cache.delete(file))
    cache.set(file, p)
  }
  return cache.get(file)
}
const loadPlugin = (rel) => loadModule(path.join(ROOT, 'plugins', rel + '.js'))
const loadConfig = () => loadModule(path.join(ROOT, 'config.js')).then((m) => m.default)
// basis data xorizn-bot (users/groups/settings/koin/energi/exp ...) — gagal memuat tidak menghentikan fitur
const loadDb = () => loadModule(path.join(ROOT, 'src', 'lib', 'xorizn-database.js')).then((m) => m.getDatabase()).catch((e) => { console.log('[XORIZN] database tidak bisa dimuat:', e.message); return null })

// ---------------------------------------------------------------- tambahan pada sock
function mediaPart(media, type) {
  const src = Buffer.isBuffer(media) ? media : typeof media === 'string' ? { url: media } : media && media.url ? media : media
  return { [type]: src }
}

function guessType(media, opts) {
  if (opts && opts.type) return opts.type
  const s = typeof media === 'string' ? media.split('?')[0].toLowerCase() : ''
  if (/\.(mp4|mkv|webm|mov)$/.test(s)) return 'video'
  if (/\.(mp3|m4a|ogg|opus|wav|aac)$/.test(s)) return 'audio'
  if (/\.(webp)$/.test(s)) return 'sticker'
  if (/\.(zip|pdf|apk|rar|7z|docx?|xlsx?|pptx?|txt|json)$/.test(s)) return 'document'
  return 'image'
}

function extend(sock) {
  S.extendSock(sock)
  if (sock.__xorizn) return sock
  sock.__xorizn = true

  // pesan album (kumpulan gambar/video): dikirim berurutan
  const orig = sock.sendMessage.bind(sock)
  sock.sendMessage = async (jid, content, opts) => {
    const st = als.getStore()
    if (st && content) {
      if (content.react && ['☢', '❌', '✘'].includes(content.react.text)) st.failed = true
      if (typeof content.text === 'string' && /ᴇʀʀᴏʀ|Terjadi kesalahan/.test(content.text)) st.failed = true
    }
    if (content && Array.isArray(content.albumMessage)) {
      let last
      for (const item of content.albumMessage) {
        last = await orig(jid, { ...item }, opts)
        await sleep(350)
      }
      return last
    }
    return orig(jid, content, opts)
  }

  // sendMedia(jid, sumber, caption, quoted, opsi) — port dari engine-socket asli:
  // sumber = Buffer | URL | path file | { url } | payload { image|video|audio|document }; type: image|video|audio (selain itu = dokumen)
  sock.sendMedia = async function (jid, source, caption = '', quoted, options = {}) {
    if (source instanceof ArrayBuffer || (ArrayBuffer.isView(source) && !Buffer.isBuffer(source))) source = Buffer.from(source.buffer ? source.buffer : source)
    if (source && typeof source === 'object' && (source.image || source.video || source.audio || source.document)) return sock.sendMessage(jid, source, options)
    let data = source
    let mimeType = options.mimetype || 'application/octet-stream'
    let fileName = options.fileName || 'file'
    if (Buffer.isBuffer(source)) {
      // data apa adanya
    } else if (typeof source === 'string' && /^https?:\/\//.test(source)) data = { url: source }
    else if (typeof source === 'string' && fs.existsSync(source)) {
      mimeType = mime.lookup(source) || 'application/octet-stream'
      fileName = path.basename(source)
      data = fs.readFileSync(source)
    } else if (source && typeof source === 'object' && !Buffer.isBuffer(source) && typeof source.url === 'string') data = { url: source.url }
    else throw new Error('Source harus berupa Buffer, URL string, path file, object { url }, atau payload media')
    const mediaType = options.type || options.mediaType
    const captionField = caption != null ? { caption } : {}
    let payload = {}
    if (mediaType === 'image') payload = { image: data, ...captionField, ...options }
    else if (mediaType === 'video') payload = { video: data, ...captionField, ...options }
    else if (mediaType === 'audio') {
      const audioMime = mimeType && mimeType !== 'application/octet-stream' ? mimeType : 'audio/mpeg'
      payload = { audio: data, mimetype: audioMime, ptt: options.ptt || false, ...options }
    } else payload = { document: data, mimetype: mimeType || 'application/octet-stream', fileName, ...captionField, ...options }
    delete payload.type
    delete payload.mediaType
    return sock.sendMessage(jid, payload, { quoted })
  }

  // foto profil: tidak pernah melempar error — pakai foto bawaan kalau kosong/privat (seperti bot asal)
  const origPP = sock.profilePictureUrl ? sock.profilePictureUrl.bind(sock) : null
  const ppCache = new Map()
  const DEFAULT_PP = 'https://i.ibb.co.com/QFzm9pSF/1546d15ce5dd2946573b3506df109d00.jpg'
  sock.profilePictureUrl = async (jid) => {
    const c = ppCache.get(jid)
    if (c && Date.now() - c.t < 900000) return c.url
    let url
    try { url = origPP ? await origPP(jid, 'image') : DEFAULT_PP } catch { url = DEFAULT_PP }
    if (!url) url = DEFAULT_PP
    ppCache.set(jid, { url, t: Date.now() })
    return url
  }
  sock.sendText = (jid, text, quoted, options = {}) => sock.sendMessage(jid, { text, ...options }, { quoted })

  // sendButton(jid, media|null, caption, quoted, { type, buttons:[{name, buttonParamsJson}], footer })
  sock.sendButton = async (jid, media, caption, quoted, opts = {}) => {
    const { sendRich } = require('../interactive')
    const type = opts.type || 'image'
    const body = String(caption || '')
    return sendRich(sock, jid, {
      media: media ? mediaPart(media, type) : undefined,
      body, footer: opts.footer || config.footer || '', buttons: opts.buttons || [], quoted, mentions: opts.mentions || [], hints: false
    })
  }

  // sendCodeBlock(jid, kode, quoted)
  sock.sendCodeBlock = async (jid, code, quoted) =>
    sock.sendMessage(jid, { text: '```' + String(code) + '```' }, quoted ? { quoted } : undefined)

  sock.getName = async (jid) => {
    try {
      const c = sock.store && sock.store.contacts && sock.store.contacts[jid]
      if (c && (c.name || c.notify)) return c.name || c.notify
    } catch {}
    return String(jid || '').split('@')[0]
  }

  // ---- stiker: mengikuti cara bot asal (sharp -> webp -> EXIF node-webpmux; video lewat ffmpeg bawaan paket) ----
  const exifLib = () => loadModule(path.join(ROOT, 'src', 'lib', 'xorizn-exif.js'))
  const isWebp = (b) => b.length > 12 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP'
  const withTimeout = (p, ms, label) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(`${label} terlalu lama (>${ms / 1000}s)`)), ms))])
  const toBuf = async (src) => {
    if (src && src.sticker) src = src.sticker
    if (typeof src === 'string' && /^https?:\/\//i.test(src)) {
      const axios = require('axios')
      const res = await axios.get(src, { responseType: 'arraybuffer', timeout: 60000, headers: { 'User-Agent': S.UA }, maxContentLength: Infinity })
      return Buffer.from(res.data)
    }
    return S.toBuffer(src)
  }
  const imgToWebp = async (buf) => {
    if (isWebp(buf)) return buf
    const sharp = require('sharp')
    return sharp(buf).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 80 }).toBuffer()
  }
  const vidToWebp = async (buf) => {
    if (isWebp(buf)) return buf
    const x = await exifLib()
    return withTimeout(x.videoToWebpFFmpeg(buf, { duration: 6, fps: 15 }), 120000, 'Konversi video ke stiker')
  }
  const stamp = async (webp, opts) => {
    try {
      const x = await exifLib()
      return await x.addExifToWebp(webp, { packname: opts.packname || opts.pack || config.stickerPack, author: opts.author || config.stickerAuthor, emojis: opts.emojis || [''] })
    } catch (e) { console.log('[XORIZN] EXIF stiker gagal, kirim tanpa metadata:', e.message); return webp }
  }
  const sendSticker = (jid, webp, quoted) => sock.sendMessage(jid, { sticker: webp }, quoted ? { quoted } : undefined)

  sock.sendImageAsSticker = async (jid, src, quoted, opts = {}) => {
    try {
      const webp = await stamp(await imgToWebp(await toBuf(src)), opts)
      return await sendSticker(jid, webp, quoted)
    } catch (e) { console.log('[XORIZN] sendImageAsSticker gagal:', e.message); throw e }
  }
  sock.sendVideoAsSticker = async (jid, src, quoted, opts = {}) => {
    try {
      const webp = await stamp(await vidToWebp(await toBuf(src)), opts)
      return await sendSticker(jid, webp, quoted)
    } catch (e) { console.log('[XORIZN] sendVideoAsSticker gagal:', e.message); throw e }
  }

  // sendStickerPack(jid, [Buffer|url], quoted, { packname, author }) — dikirim sebagai deretan stiker berpaket
  sock.sendStickerPack = async (jid, items, quoted, opts = {}) => {
    if (!items || !items.length) throw new Error('Tidak ada stiker')
    let sent = 0
    for (const it of items) {
      try {
        let buf = await toBuf(it)
        const gif = buf.toString('hex', 0, 4) === '47494638'
        buf = gif ? await vidToWebp(buf) : await imgToWebp(buf)
        await sendSticker(jid, await stamp(buf, { packname: opts.packname || opts.name, author: opts.author || opts.publisher, emojis: opts.emojis }), quoted)
        sent++
        await sleep(600)
      } catch (e) { console.log('[XORIZN] stiker pack gagal satu item:', e.message) }
    }
    if (!sent) throw new Error('Tidak ada stiker yang berhasil dikirim')
    return sent
  }
  return sock
}

// ---------------------------------------------------------------- objek m gaya xorizn-bot
function buildM(sock, ctx, reply, passive = false) {
  const { msg, from, sender, isGroup, body, text, args, command } = ctx
  const usedPrefix = !passive && body && body.startsWith(ctx.prefix) ? ctx.prefix : ''
  const m = S.serialize(sock, msg, { from, sender, isGroup, body, reply })
  m.prefix = usedPrefix
  m.command = command || ''
  m.args = args || []
  m.text = text || ''
  m.fullArgs = text || ''
  m.body = body || ''
  m.isCommand = !passive
  m.type = m.mtype
  m.isImage = m.type === 'imageMessage'
  m.isVideo = m.type === 'videoMessage'
  m.isAudio = m.type === 'audioMessage'
  m.isSticker = m.type === 'stickerMessage'
  m.isDocument = m.type === 'documentMessage'
  m.isMedia = MEDIA_RE.test(m.type)
  const q = m.quoted
  if (q) {
    q.type = q.mediaType || q.mtype
    q.isImage = q.type === 'imageMessage'
    q.isVideo = q.type === 'videoMessage'
    q.isAudio = q.type === 'audioMessage'
    q.isSticker = q.type === 'stickerMessage'
    q.isDocument = q.type === 'documentMessage'
    q.isMedia = MEDIA_RE.test(q.type)
    q.filename = (q.msg && q.msg.fileName) || ''
    q.quotedBody = ''
  }
  m.quotedBody = q ? q.text || '' : ''
  return m
}

// ---------------------------------------------------------------- pemeriksaan sebelum jalan
const cooldowns = new Map()

function hasStub(file) {
  try { return fs.readFileSync(file, 'utf8').includes('__XORIZN_STUB__') } catch { return true }
}

function preflight(meta, ctx) {
  const { isOwner, isGroup, sender } = ctx
  if (meta.private && isGroup) return 'Fitur ini hanya bisa dipakai di chat pribadi bot.'
  if (meta.premium && !isOwner && !ztowner.isPremium(sender)) return 'Fitur ini khusus user premium.'
  const need = meta.needs || {}
  for (const k of need.apikeys || []) {
    if (!(global.apiKeys && global.apiKeys[k])) {
      return `Fitur ini butuh apikey *${k}* yang belum diisi.\nOwner: isi \`global.apiKeys.${k}\` di settings.js lalu restart bot.`
    }
  }
  for (const s of need.scrapers || []) {
    if (hasStub(path.join(ROOT, 'src', 'scraper', s + '.js'))) {
      return `Fitur ini butuh file scraper *${s}.js* dari script asal, dan file itu belum dipasang.\nOwner: timpa \`xorizn/src/scraper/${s}.js\` dengan file aslinya.`
    }
  }
  for (const a of need.assets || []) {
    let ok = false
    try { ok = require('fs').readdirSync(path.join(ROOT, 'assets')).some((f) => f.replace(/\.[^.]+$/, '') === a || f === a) } catch {}
    if (!ok) return `Fitur ini butuh aset *${a}* dari script asal, dan filenya belum ada.\nOwner: taruh di \`xorizn/assets/${a}.<ekstensi>\`.`
  }
  if (meta.cooldown && !isOwner) {
    const k = `${meta.name}:${sender}`
    const last = cooldowns.get(k) || 0
    const wait = meta.cooldown * 1000 - (Date.now() - last)
    if (wait > 0) return `Tunggu ${Math.ceil(wait / 1000)} detik lagi sebelum memakai perintah ini.`
  }
  return null
}

// ---------------------------------------------------------------- pembungkus plugin
function plugin(rel, meta) {
  const cmds = [...new Set(meta.command.map((c) => String(c).toLowerCase()))]
  // hasil harus persis seperti plugin asal: lewati lapisan penataan otomatis (fmt/richui) untuk perintah ini
  global.uiPlain = [...new Set([...(global.uiPlain || []), ...cmds])]

  return {
    name: meta.name || cmds[0],
    command: cmds,
    category: meta.category,
    desc: meta.desc || `Perintah ${cmds[0]}`,
    usage: meta.usage || '',
    owner: !!meta.owner,
    group: !!meta.group,
    admin: !!meta.admin,
    botAdmin: !!meta.botAdmin,
    selfReact: true, // plugin mengatur reaksinya sendiri (🕕/✅/❌)
    run: async (ctx) => {
      const { sock, msg, from, sender, isOwner } = ctx
      extend(sock)
      const quotedOpt = { quoted: msg }
      const reply = (text, chatId, options = {}) => sock.sendMessage(chatId || from, { text: typeof text === 'string' ? text : String(text), ...options }, quotedOpt)

      const block = preflight(meta, ctx)
      if (block) return reply(block)

      let mod
      try {
        mod = await loadPlugin(rel)
      } catch (err) {
        console.log(`[XORIZN] gagal memuat ${rel}:`, err.message)
        const pkg = /Cannot find (?:package|module) '([^']+)'/.exec(err.message)
        return reply(pkg ? `Dependensi *${pkg[1]}* belum terpasang. Owner: jalankan \`npm install\` lalu restart bot.` : `Fitur gagal dimuat: ${err.message}`)
      }
      if (typeof mod.handler !== 'function') return reply('Fitur ini tidak punya handler.')

      const cost = Number(meta.energi) || 0
      if (cost > 0) {
        const lack = limit.lack(sender, cost, isOwner)
        if (lack) return reply(lack)
      }
      if (meta.cooldown) cooldowns.set(`${meta.name}:${sender}`, Date.now())

      const st = { cmd: meta.name, errs: [], failed: false }
      const m = buildM(sock, ctx, reply)
      const db = await loadDb()
      m.isOwner = !!isOwner
      m.isPremium = !!isOwner || !!ztowner.isPremium(sender)
      m.isAdmin = !!ctx.isAdmin
      m.isBotAdmin = !!ctx.isBotAdmin
      m.isGroup = !!ctx.isGroup
      m.isBanned = false
      if (db) { try { if (!db.getUser(sender)) db.setUser(sender, { name: ctx.msg.pushName || '' }) } catch {} }
      const params = {
        db, uptime: process.uptime() * 1000,
        sock, m, msg, text: ctx.text, args: ctx.args, command: ctx.command, usedPrefix: m.prefix, prefix: m.prefix, reply,
        isOwner, isGroup: ctx.isGroup, isAdmin: ctx.isAdmin, isBotAdmin: ctx.isBotAdmin, groupMetadata: ctx.groupMetadata,
        config: await loadConfig()
      }
      try {
        await als.run(st, () => mod.handler(m, params))
      } catch (err) {
        globalThis.__xoriznCatch(err)
        st.failed = true
      }
      if (cost > 0 && !st.failed) limit.spend(sender, cost, isOwner)
      if (st.failed && isOwner && st.errs.length) {
        const e = st.errs[st.errs.length - 1]
        await reply(`🔧 *Detail error (khusus owner)*\n\nFitur: ${meta.name}\nPenyebab: ${e.msg}\n${e.at ? 'Lokasi: ' + e.at.slice(0, 160) : ''}`).catch(() => {})
      }
    }
  }
}

// ---------------------------------------------------------------- handler pasif (jawaban sesi: pilih nomor, dll)
// hook(rel, ['caiAnswerHandler', ...]) -> modul hook xorizn-bot yang memanggil handler(m, sock) tiap pesan non-perintah.
function hook(items) {
  return {
    hook: true,
    name: 'xorizn-passive',
    passive: async (ctx) => {
      if (!ctx.body) return false
      // hanya pesan biasa (bukan perintah berprefix)
      if (ctx.prefix && ctx.body.startsWith(ctx.prefix)) return false
      const { sock, msg, from, sender, isGroup } = ctx
      extend(sock)
      const reply = (text, chatId, options = {}) => sock.sendMessage(chatId || from, { text: String(text), ...options }, { quoted: msg })
      let m = null
      for (const it of items) {
        let mod
        try { mod = await loadPlugin(it.rel) } catch { continue }
        for (const fn of it.fns) {
          if (typeof mod[fn] !== 'function') continue
          if (!m) m = buildM(sock, { ...ctx, text: '', args: [], command: '' }, reply, true)
          try { if (await mod[fn](m, sock)) return true } catch (err) { console.log(`[XORIZN] hook ${it.rel}:${fn}`, err.message) }
        }
      }
      return false
    }
  }
}

const tag = require('./rank')
module.exports = { plugin: tag(1, plugin), hook: tag(1, hook), extend, buildM, loadPlugin, ROOT }
