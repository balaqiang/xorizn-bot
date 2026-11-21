// lib/sahril.js — lapisan kompatibilitas untuk plugin hasil porting "plugin baru" (gaya handler(m, { sock, ... })).
// Tujuan: logika & TEKS OUTPUT plugin asli dipertahankan apa adanya, sementara bot tetap memakai format plugin vanXone.
//   • wrap(handler, meta)  -> objek plugin vanXone { name, command, category, run, ... }
//   • m (serialize) + konteks { sock, text, reply, usedPrefix, example, ... } dibangun dari ctx bot.js
//   • global.fetchApi / postApi / API / getBuffer / addExif / videoToWebp + sock.sendImageAsSticker dst.
'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')
const crypto = require('crypto')
const axios = require('axios')
const pino = require('pino')
const baileys = require('@whiskeysockets/baileys')
const config = require('../../config')
const owners = require('../owners')
const limit = require('../limit')
const ffm = require('../ffm')
const jstore = require('../jstore')
const { userOf, sameUser } = require('../utils')

const { normalizeMessageContent, downloadMediaMessage } = baileys
const logger = pino({ level: 'silent' })
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

// ---------------------------------------------------------------- pengaturan tersimpan (prefix, regis, dll)
const st = jstore.open('sahril', {
  regis: false, // wajib daftar sebelum pakai bot
  registered: [], // nomor yang sudah daftar
  prefix: '', // prefix hasil .setprefix ('' = pakai settings.js)
  multiprefix: true, // false = bot dipakai TANPA prefix (semua orang)
  noprefixOwner: false // true = owner boleh tanpa prefix
})
const baseSettingsPrefix = config.prefix
if (st.data.prefix) applyPrefix(st.data.prefix)

function applyPrefix(p) {
  config.prefix = p
  global.prefix = p
  global.__prefix = p
}

// ---------------------------------------------------------------- global bawaan bot asal
function initGlobals() {
  if (global.__sahrilGlobals) return
  global.__sahrilGlobals = true
  global.namaBot = config.botName
  global.namaOwner = config.ownerName
  if (!global.packname) global.packname = config.stickerPack
  if (!global.author) global.author = config.stickerAuthor
  if (global.thumbnail === undefined) global.thumbnail = ''
  if (!global.idch) global.idch = (config.newsletter && config.newsletter.jid) || ''
  if (!global.namech) global.namech = (config.newsletter && config.newsletter.name) || ''
  global.APIs = Object.assign(
    {
      kyzz: 'https://api.kyzzz.xyz',
      siputzx: 'https://api.siputzx.my.id',
      azbry: 'https://api.azbry.com',
      deline: 'https://api.deline.web.id'
    },
    global.APIs || {}
  )
  global.apiKeys = Object.assign({ kyzz: '', azbry: '', siputzx: '' }, global.apiKeys || {})

  global.API = apiUrl
  global.fetchApi = fetchApi
  global.postApi = postApi
  global.getBuffer = getBuffer
  global.addExif = addExif
  global.videoToWebp = videoToWebp
}

function errFromResponse(e) {
  const d = e && e.response && e.response.data
  if (d) {
    let t = ''
    try {
      t = Buffer.isBuffer(d) || d instanceof ArrayBuffer ? Buffer.from(d).toString('utf8') : typeof d === 'string' ? d : JSON.stringify(d)
    } catch {}
    try {
      const j = JSON.parse(t)
      const msg = j.message || j.error || j.msg
      if (msg) return new Error(String(msg))
    } catch {}
    if (t && t.length < 300) return new Error(t)
  }
  return e
}

// URL API: apiUrl('kyzz', '/api/x', { a: 1 }, 'apikey')
function apiUrl(name, p, params = {}, keyParam) {
  const base = String((global.APIs && global.APIs[name]) || '').replace(/\/+$/, '')
  if (!base) throw new Error(`API "${name}" belum terdaftar di global.APIs (settings.js).`)
  const key = global.apiKeys && global.apiKeys[name]
  if (name === 'kyzz' && !key) throw new Error('Apikey kyzz belum diisi. Owner: isi global.apiKeys = { kyzz: "..." } di settings.js')
  const u = new URL(base + '/' + String(p).replace(/^\/+/, ''))
  for (const [k, v] of Object.entries(params || {})) if (v !== undefined && v !== null) u.searchParams.set(k, String(v))
  if (key) u.searchParams.set(keyParam || 'apikey', key)
  return u.toString()
}

async function fetchApi(name, p, params = {}, opts = {}) {
  const url = apiUrl(name, p, params)
  try {
    const res = await axios.get(url, { timeout: 60000, headers: { 'User-Agent': UA }, ...opts })
    return opts.responseType === 'arraybuffer' ? Buffer.from(res.data) : res.data
  } catch (e) {
    throw errFromResponse(e)
  }
}

async function postApi(name, p, body, opts = {}) {
  const url = apiUrl(name, p, {})
  const headers = { 'User-Agent': UA, ...(body && typeof body.getHeaders === 'function' ? body.getHeaders() : {}), ...(opts.headers || {}) }
  try {
    const res = await axios.post(url, body, { timeout: 90000, maxBodyLength: Infinity, maxContentLength: Infinity, ...opts, headers })
    return opts.responseType === 'arraybuffer' ? Buffer.from(res.data) : res.data
  } catch (e) {
    throw errFromResponse(e)
  }
}

async function getBuffer(url, opts = {}) {
  const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 60000, headers: { 'User-Agent': UA }, ...opts })
  return Buffer.from(res.data)
}

// pengganti node-fetch (mendukung opsi { timeout })
function fetchCompat(url, opts = {}) {
  const { timeout, ...rest } = opts
  if (timeout && !rest.signal) rest.signal = AbortSignal.timeout(timeout)
  return fetch(url, rest)
}

// pengganti file-type (ESM murni) dengan cadangan magic-bytes sederhana
async function fileTypeFromBuffer(buf) {
  try {
    const ft = await import('file-type')
    const r = await ft.fileTypeFromBuffer(buf)
    if (r) return r
  } catch {}
  const b = Buffer.from(buf.subarray ? buf.subarray(0, 16) : buf)
  const is = (...bytes) => bytes.every((x, i) => b[i] === x)
  if (is(0xff, 0xd8, 0xff)) return { ext: 'jpg', mime: 'image/jpeg' }
  if (is(0x89, 0x50, 0x4e, 0x47)) return { ext: 'png', mime: 'image/png' }
  if (is(0x47, 0x49, 0x46)) return { ext: 'gif', mime: 'image/gif' }
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') return { ext: 'webp', mime: 'image/webp' }
  if (b.toString('ascii', 4, 8) === 'ftyp') return { ext: 'mp4', mime: 'video/mp4' }
  if (is(0x49, 0x44, 0x33) || is(0xff, 0xfb)) return { ext: 'mp3', mime: 'audio/mpeg' }
  if (b.toString('ascii', 0, 4) === 'OggS') return { ext: 'ogg', mime: 'audio/ogg' }
  if (b.toString('ascii', 0, 4) === '%PDF') return { ext: 'pdf', mime: 'application/pdf' }
  if (is(0x50, 0x4b, 0x03, 0x04)) return { ext: 'zip', mime: 'application/zip' }
  return undefined
}

// ---------------------------------------------------------------- stiker: EXIF + konversi video
function vp8Info(type, data) {
  if (type === 'VP8 ' && data.length >= 10) return { w: data.readUInt16LE(6) & 0x3fff, h: data.readUInt16LE(8) & 0x3fff, alpha: false }
  if (type === 'VP8L' && data.length >= 5) {
    const bits = data.readUInt32LE(1)
    return { w: (bits & 0x3fff) + 1, h: ((bits >>> 14) & 0x3fff) + 1, alpha: !!((bits >>> 28) & 1) }
  }
  return null
}
const chunk = (type, data) => Buffer.concat([Buffer.from(type, 'ascii'), (() => { const s = Buffer.alloc(4); s.writeUInt32LE(data.length); return s })(), data, data.length % 2 ? Buffer.alloc(1) : Buffer.alloc(0)])

function stickerExif(meta) {
  const json = Buffer.from(JSON.stringify(meta), 'utf8')
  const head = Buffer.from([0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00])
  const exif = Buffer.concat([head, Buffer.alloc(4), Buffer.from([0x16, 0x00, 0x00, 0x00]), json])
  exif.writeUInt32LE(json.length, 14)
  return exif
}

// Sisipkan EXIF (nama pack + author) ke WEBP tanpa mengenkode ulang gambar (animasi tetap utuh).
function webpWithExif(webp, meta) {
  if (!Buffer.isBuffer(webp) || webp.length < 20 || webp.toString('ascii', 0, 4) !== 'RIFF' || webp.toString('ascii', 8, 12) !== 'WEBP') throw new Error('File bukan WEBP valid.')
  const chunks = []
  let off = 12
  while (off + 8 <= webp.length) {
    const type = webp.toString('ascii', off, off + 4)
    const size = webp.readUInt32LE(off + 4)
    const end = off + 8 + size + (size % 2)
    if (end > webp.length + 1) break
    chunks.push({ type, data: webp.subarray(off + 8, off + 8 + size) })
    off = end
  }
  const kept = chunks.filter((c) => c.type !== 'EXIF')
  let vp8x = kept.find((c) => c.type === 'VP8X')
  if (vp8x) {
    const d = Buffer.from(vp8x.data)
    d[0] |= 0x08
    vp8x = { type: 'VP8X', data: d }
    kept[kept.indexOf(kept.find((c) => c.type === 'VP8X'))] = vp8x
  } else {
    const img = kept.find((c) => c.type === 'VP8 ' || c.type === 'VP8L')
    const info = img && vp8Info(img.type, img.data)
    if (!info) throw new Error('Struktur WEBP tidak dikenali.')
    const d = Buffer.alloc(10)
    d[0] = 0x08 | (info.alpha ? 0x10 : 0)
    d.writeUIntLE(info.w - 1, 4, 3)
    d.writeUIntLE(info.h - 1, 7, 3)
    kept.unshift({ type: 'VP8X', data: d })
  }
  kept.push({ type: 'EXIF', data: stickerExif(meta) })
  const body = Buffer.concat(kept.map((c) => chunk(c.type, c.data)))
  const header = Buffer.alloc(12)
  header.write('RIFF', 0, 'ascii')
  header.writeUInt32LE(body.length + 4, 4)
  header.write('WEBP', 8, 'ascii')
  return Buffer.concat([header, body])
}

async function addExif(webp, packname, author) {
  return webpWithExif(webp, {
    'sticker-pack-id': crypto.randomBytes(16).toString('hex'),
    'sticker-pack-name': String(packname || ''),
    'sticker-pack-publisher': String(author || ''),
    emojis: ['']
  })
}

// video/gif -> WEBP animasi 512x512 (maks 6 detik)
async function videoToWebp(buffer) {
  return ffm.run(
    Buffer.from(buffer),
    'webp',
    (i, o) => [
      '-i', i,
      '-vcodec', 'libwebp',
      '-vf', "scale='min(512,iw)':'min(512,ih)':force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse",
      '-loop', '0', '-ss', '0', '-t', '6', '-preset', 'default', '-an', '-vsync', '0', o
    ],
    120000
  )
}

async function toBuffer(src) {
  if (Buffer.isBuffer(src)) return src
  if (src instanceof ArrayBuffer || ArrayBuffer.isView(src)) return Buffer.from(src.buffer ? src.buffer : src)
  if (typeof src === 'string') {
    if (/^https?:\/\//i.test(src)) return getBuffer(src)
    if (/^data:/.test(src)) return Buffer.from(src.split(',')[1] || '', 'base64')
    return fs.promises.readFile(src)
  }
  if (src && src.url) return toBuffer(src.url)
  throw new Error('Sumber media tidak dikenali.')
}

// ---------------------------------------------------------------- tambahan pada sock (gaya baileys fork bot asal)
function extendSock(sock) {
  if (sock.__sahril) return sock
  sock.__sahril = true
  const { Sticker, StickerTypes } = require('wa-sticker-formatter')
  const mk = async (jid, src, quoted, opts = {}) => {
    const buf = await toBuffer(src)
    const sticker = new Sticker(buf, {
      pack: opts.packname || opts.pack || config.stickerPack,
      author: opts.author || config.stickerAuthor,
      type: StickerTypes.FULL,
      quality: opts.quality || 70
    })
    return sock.sendMessage(jid, { sticker: await sticker.toBuffer() }, quoted ? { quoted } : undefined)
  }
  if (!sock.sendImageAsSticker) sock.sendImageAsSticker = mk
  if (!sock.sendVideoAsSticker) sock.sendVideoAsSticker = mk
  if (!sock.downloadAndSaveMediaMessage) {
    sock.downloadAndSaveMediaMessage = async (q, name) => {
      const buf = typeof q.download === 'function' ? await q.download() : null
      if (!buf) throw new Error('Gagal mengunduh media.')
      const ft = await fileTypeFromBuffer(buf)
      const file = path.join(os.tmpdir(), `${name || 'dl_' + Date.now() + '_' + crypto.randomBytes(3).toString('hex')}.${ft ? ft.ext : 'bin'}`)
      await fs.promises.writeFile(file, buf)
      return file
    }
  }
  if (!sock.createAIRich) sock.createAIRich = () => aiRich(sock)
  return sock
}

// tombol & kartu lokasi: diteruskan ke pengirim vanXone asli (sock.sendButtons, lib/ztsend.js)
// buttons: { displayText|text, url } | { displayText|text, copy } | { sectionTitle, title, rows:[{title, description, id}] } | { name, buttonParamsJson }
async function sendButtons(sock, jid, data = {}, opts = {}) {
  if (typeof sock.sendButtons !== 'function') throw new Error('pengirim tombol belum terpasang')
  const content = { ...data }
  if (content.media && !content.image && !content.video && !content.document) {
    const md = content.media
    if (md.image) content.image = md.image
    else if (md.video) content.video = md.video
    else if (md.document) { content.document = md.document; content.mimetype = md.mimetype; content.filename = md.fileName || md.filename }
    delete content.media
  }
  if (content.caption && !content.text) content.text = content.caption
  return sock.sendButtons(jid, content, opts)
}

// kartu dengan header lokasi + tombol (`{ location, text, footer, buttons }`) lewat sendButtons vanXone
async function sendLocationCard(sock, jid, data = {}, opts = {}) {
  const loc = data.location || {}
  const content = { ...data }
  delete content.location
  content.location = { lat: loc.degreesLatitude || 0, lng: loc.degreesLongitude || 0, name: loc.name || '', address: loc.address || '', jpegThumbnail: loc.jpegThumbnail }
  return sendButtons(sock, jid, content, opts)
}

// cadangan createAIRich (fitur khusus fork baileys bot asal): kirim teks + media biasa
function aiRich(sock) {
  const parts = []
  const api = {
    addText(t) { parts.push({ t: 'text', v: t }); return api },
    addImage(u) { parts.push({ t: 'image', v: u }); return api },
    addVideo(u) { parts.push({ t: 'video', v: u }); return api },
    async send(jid, o = {}) {
      const text = parts.filter((p) => p.t === 'text').map((p) => p.v).join('\n\n')
      const media = parts.filter((p) => p.t !== 'text')
      if (!media.length) return sock.sendMessage(jid, { text }, o)
      let first = true
      for (const p of media) {
        const content = p.t === 'video' ? { video: { url: p.v } } : { image: { url: p.v } }
        if (first) content.caption = text
        first = false
        await sock.sendMessage(jid, content, o)
      }
    }
  }
  return api
}

// ---------------------------------------------------------------- serialize pesan -> objek m
const cleanJid = (j) => (j ? String(j).replace(/:\d+(?=@)/, '') : j)
const rawType = (message) => Object.keys(message || {}).find((k) => k !== 'messageContextInfo' && k !== 'senderKeyDistributionMessage') || ''

function textOf(msgObj, type) {
  if (!msgObj) return ''
  if (typeof msgObj === 'string') return msgObj
  return msgObj.text || msgObj.caption || msgObj.conversation || ''
}

function buildQuoted(sock, msg, from, isGroup) {
  const norm = normalizeMessageContent(msg.message)
  const type = rawType(norm)
  const ci = (norm && norm[type] && norm[type].contextInfo) || undefined
  if (!ci || !ci.quotedMessage) return null
  const rawQ = ci.quotedMessage
  const qNorm = normalizeMessageContent(rawQ) || rawQ
  const qType = rawType(qNorm)
  const qRawType = rawType(rawQ)
  const qMsg = qNorm[qType] || {}
  const participant = ci.participant || (isGroup ? undefined : from)
  const key = { remoteJid: from, fromMe: !!participant && (sameUser(participant, sock.user && sock.user.id) || sameUser(participant, sock.user && sock.user.lid)), id: ci.stanzaId, participant: isGroup ? participant : undefined }
  const text = qNorm.conversation || (qMsg && (qMsg.text || qMsg.caption)) || ''
  const fake = { key, message: rawQ }
  const q = {
    key,
    id: ci.stanzaId,
    chat: from,
    sender: cleanJid(participant),
    message: qNorm,
    mtype: /viewOnce/i.test(qRawType) ? qRawType : qType,
    msg: qMsg,
    text,
    body: text,
    caption: (qMsg && qMsg.caption) || '',
    mimetype: (qMsg && qMsg.mimetype) || '',
    mediaType: qType,
    seconds: (qMsg && qMsg.seconds) || 0,
    contextInfo: (qMsg && qMsg.contextInfo) || {},
    isBaileys: typeof ci.stanzaId === 'string' && ci.stanzaId.startsWith('BAE5') && ci.stanzaId.length === 16,
    pushName: '',
    fakeObj: fake,
    download: () => downloadMediaMessage(fake, 'buffer', {}, { logger, reuploadRequest: sock.updateMediaMessage })
  }
  return q
}

function serialize(sock, msg, base) {
  const { from, sender, isGroup, body, reply } = base
  const norm = normalizeMessageContent(msg.message) || {}
  const mtype = rawType(norm)
  const content = norm[mtype] || {}
  const ci = (content && content.contextInfo) || {}
  const m = {
    key: msg.key,
    id: msg.key.id,
    chat: from,
    sender: cleanJid(sender),
    fromMe: !!msg.key.fromMe,
    isGroup,
    pushName: msg.pushName || '',
    pushname: msg.pushName || '',
    name: msg.pushName || '',
    message: norm,
    mtype,
    msg: content,
    text: body,
    body,
    caption: content.caption || '',
    mimetype: content.mimetype || '',
    seconds: content.seconds || 0,
    mentionedJid: ci.mentionedJid || [],
    mentions: ci.mentionedJid || [],
    isBaileys: typeof msg.key.id === 'string' && msg.key.id.startsWith('BAE5') && msg.key.id.length === 16,
    messageTimestamp: Number((msg.messageTimestamp && msg.messageTimestamp.low) || msg.messageTimestamp || 0),
    fakeObj: msg,
    contextInfo: ci,
    reply: (text, chatId, options = {}) => reply(text, chatId, options),
    react: (emoji) => sock.sendMessage(from, { react: { text: emoji, key: msg.key } }).catch(() => null),
    download: () => downloadMediaMessage(msg, 'buffer', {}, { logger, reuploadRequest: sock.updateMediaMessage })
  }
  m.quoted = buildQuoted(sock, msg, from, isGroup)
  return m
}

// ---------------------------------------------------------------- pemeriksaan owner utama (developer / owner tetap / bot sendiri)
function isMainOwner(msg, sender) {
  if (msg.key && msg.key.fromMe) return true
  const fixed = owners.fixed()
  const k = msg.key || {}
  return [sender, k.participantPn, k.senderPn, k.remoteJidAlt, k.participantAlt, k.participant_pn].some((j) => j && fixed.includes(userOf(j)))
}

// ---------------------------------------------------------------- pembungkus plugin
const TAG_CATEGORY = { downloader: 'downloader', maker: 'image', owner: 'owner', tools: 'tools', game: 'game', info: 'info', ai: 'tools', internet: 'tools', convert: 'tools', premium: 'owner' }
const categoryOf = (h) => {
  for (const t of [].concat(h.tags || [])) if (TAG_CATEGORY[t]) return TAG_CATEGORY[t]
  return 'tools'
}

function wrap(handler, meta = {}) {
  initGlobals()
  const cmds = [...new Set([].concat(handler.command, meta.extra || []).map((c) => String(c).toLowerCase()))]
  // hasil harus persis seperti plugin asal: lewati lapisan penataan otomatis (fmt/richui) untuk perintah ini
  global.uiPlain = [...new Set([...(global.uiPlain || []), ...cmds])]

  return {
    name: meta.name || cmds[0],
    command: cmds,
    category: meta.category || categoryOf(handler),
    desc: meta.desc || (handler.help && handler.help[0] ? `Fitur ${handler.help[0]}` : `Perintah ${cmds[0]}`),
    usage: meta.usage || '',
    owner: !!(handler.owner || handler.mainOwner || handler.rowner),
    group: !!handler.group,
    selfReact: true, // plugin mengatur reaksi sendiri (⏳/✨/❌) — bot.js tidak menimpa dengan ⏳/✅
    run: async (ctx) => {
      const { sock, msg, from, sender, isGroup, isOwner } = ctx
      extendSock(sock)
      const quotedOpt = { quoted: msg }
      const usedPrefix = ctx.body && ctx.body.startsWith(ctx.prefix) ? ctx.prefix : ''
      const reply = (text, chatId, options = {}) => sock.sendMessage(chatId || from, { text: typeof text === 'string' ? text : String(text), ...options }, quotedOpt)
      const m = serialize(sock, msg, { from, sender, isGroup, body: ctx.body, reply })
      const qmsg = m.quoted ? m.quoted : m
      const mime = ((qmsg.msg || qmsg).mimetype) || ''
      const example = (t) => `Example: ${usedPrefix}${ctx.command} ${t}`
      const mess = { group: config.mess.only.group, owner: config.mess.only.owner, admin: config.mess.only.admin, botAdmin: config.mess.only.badmin }

      // batas: hanya owner/premium bebas limit (handler.limit = pakai 1 limit)
      if (handler.limit) {
        const lack = limit.lack(sender, 1, isOwner)
        if (lack) return reply(lack)
      }
      if (meta.mainOnly && !isMainOwner(msg, sender)) return reply(config.mess.only.owner)

      const botSet = settingsView(ctx)
      const args = ctx.args
      const params = {
        sock, m, msg, text: ctx.text, args, reply, usedPrefix, prefix: ctx.prefix, command: ctx.command, example, mess, qmsg, mime,
        isOwner, isBan: false, isGroup, botSet, setSetting: (k, v) => setSetting(ctx, k, v), setNoPrefix, botNumber: userOf(sock.user && sock.user.id),
        getGroup: async (jid) => groupView(jid), updateData: async (_t, jid, field, val) => updateGroup(jid, field, val),
        getMutedGroups: async () => require('../groups').listGroups().filter(([, g]) => g.muted).map(([id]) => ({ id })),
        getAllBypassGroups: async () => require('./pulse-owner').listBypass().map((id) => ({ id })),
        db: stickerDb, owners: extraOwners(), premium: require('./pulse-owner').listPrem().map((x) => `${x}@s.whatsapp.net`),
        groupMetadata: ctx.groupMetadata, isAdmin: ctx.isAdmin, isBotAdmin: ctx.isBotAdmin,
        // dipakai menu vanXone (menu / setmenu)
        isPremium: isOwner || require('./pulse-owner').isPremium(sender), isJadiBot: false,
        getMenuData: () => menuData(ctx.plugins), getPluginStats: () => pluginStats(ctx.plugins),
        getMenuConfig, setMenuConfig,
        // mode RICH: .menu tampil sebagai kartu interaktif (lib/richmenu.js); mode TEXT / gagal -> false, menu vanXone biasa
        richMenu: (sub) => require('../richmenu').send(ctx, sub)
      }
      params.db = Object.assign({}, stickerDb, { getLimitInfo: (jid) => limitInfo(jid), getMenuConfig, setMenuConfig, getPollCommands: () => pollStore, saveDatabase: () => {} })
      m.senderInfo = { jid: sender, lid: /@lid$/.test(sender || '') ? sender : '' }
      await handler(m, params)
      if (handler.limit) limit.spend(sender, 1, isOwner)
    }
  }
}

// ---------------------------------------------------------------- data untuk menu vanXone
const menuStore = jstore.open('ztmenu', { type: 'buttons list' })
const getMenuConfig = () => menuStore.data
const setMenuConfig = (d) => { const nd = d && typeof d === 'object' ? d : { type: 'buttons list' }; for (const k of Object.keys(menuStore.data)) delete menuStore.data[k]; Object.assign(menuStore.data, nd); menuStore.save(); return menuStore.data }
const pollStore = {}
const limitInfo = (jid) => {
  const u = require('../db').getUser(jid)
  return { limit: u.limit, max: Number(global.limit) || Math.max(u.limit, 10), resetIn: 0 }
}
// kategori -> [{ cmd, aliases }] dari plugin yang termuat (format getMenuData vanXone)
function menuData(plugins = []) {
  const out = {}
  for (const p of plugins) {
    const cmds = [].concat(p.command || []).map(String)
    if (!cmds.length) continue
    const cat = String(p.category || 'lainnya').toLowerCase()
    ;(out[cat] = out[cat] || []).push({ cmd: cmds[0], aliases: cmds.slice(1) })
  }
  for (const k of Object.keys(out)) out[k].sort((a, b) => a.cmd.localeCompare(b.cmd))
  return out
}
function pluginStats(plugins = []) {
  const data = Object.entries(menuData(plugins)).map(([category, l]) => ({ category, count: l.length })).sort((a, b) => a.category.localeCompare(b.category))
  return { totalCategory: data.length, totalFiles: data.reduce((n, d) => n + d.count, 0), data }
}

// ---------------------------------------------------------------- pengaturan bot (mode, prefix, regis)
function settingsView(ctx) {
  return {
    get public() { return ctx.settings.mode !== 'self' },
    get prefix() { return config.prefix },
    get multiprefix() { return st.data.multiprefix !== false },
    get regis() { return !!st.data.regis },
    get noprefix() { return !!st.data.noprefixOwner }
  }
}

function setSetting(ctx, key, value) {
  if (key === 'public') {
    ctx.settings.mode = value ? 'public' : 'self'
    ctx.saveSettings()
    return value
  }
  if (key === 'prefix') {
    const p = String(value || baseSettingsPrefix)
    st.data.prefix = p === baseSettingsPrefix ? '' : p
    applyPrefix(p)
    st.save()
    return p
  }
  if (key === 'multiprefix') { st.data.multiprefix = !!value; st.save(); return !!value }
  if (key === 'regis') { st.data.regis = !!value; st.save(); return !!value }
  return value
}
function setNoPrefix(on) { st.data.noprefixOwner = !!on; st.save(); return !!on }

// panjang prefix yang dipakai pada pesan (−1 = bukan perintah). Mendukung mode tanpa prefix.
function prefixLen(body, isOwner, isCommand) {
  if (body.startsWith(config.prefix)) return config.prefix.length
  const word = (body.trim().split(/\s+/)[0] || '').toLowerCase()
  if (!word || !isCommand(word)) return -1
  if (st.data.multiprefix === false) return 0
  if (st.data.noprefixOwner && isOwner) return 0
  return -1
}

// gerbang pendaftaran (aktif hanya jika owner menyalakan .regis on)
const regNum = (jid) => userOf(jid)
const isRegistered = (jid) => st.data.registered.includes(regNum(jid))
function register(jid) {
  const n = regNum(jid)
  if (st.data.registered.includes(n)) return false
  st.data.registered.push(n)
  st.save()
  return true
}
function unregister(jid) {
  const i = st.data.registered.indexOf(regNum(jid))
  if (i === -1) return false
  st.data.registered.splice(i, 1)
  st.save()
  return true
}
const regisBlock = (jid, isOwner, command) => !!st.data.regis && !isOwner && !isRegistered(jid) && !['daftar', 'register', 'reg', 'verify'].includes(command)

// ---------------------------------------------------------------- tampilan data grup gaya bot asal (mute / gcbypass)
const groupView = (jid) => ({ mute: require('../groups').getGroup(jid).muted ? 1 : 0, gcbypass: require('./pulse-owner').isBypass(jid) ? 1 : 0 })
function updateGroup(jid, field, val) {
  if (field === 'mute') require('../groups').setGroup(jid, { muted: !!val })
  else if (field === 'gcbypass') require('./pulse-owner').setBypass(jid, !!val)
}

// ---------------------------------------------------------------- data pendukung plugin
const extraOwners = () => (owners.store.data.ids || []).map((n) => `${n}@s.whatsapp.net`)
const stickerStore = jstore.open('stickerpack', { sticker: {} })
const stickerDb = { raw: () => stickerStore.data, saveDatabase: () => stickerStore.save() }

module.exports = {
  UA, wrap, serialize, extendSock, initGlobals, isMainOwner,
  fetch: fetchCompat, fileTypeFromBuffer,
  fetchApi, postApi, apiUrl, getBuffer, addExif, videoToWebp, webpWithExif, toBuffer, sendButtons, sendLocationCard,
  prefixLen, regisBlock, isRegistered, register, unregister, setNoPrefix, store: st, applyPrefix, extraOwners
}
