// lib/anya.js — adapter agar plugin vanXone MD V8 asli (ESM, gaya handler(m, { conn, ... })) berjalan di vanXone.
// Kode plugin vanXone dipakai APA ADANYA dari folder /anya (hanya nama vanXone/pembuat → vanXone). Yang dibuat di sini:
//   • plugin(rel, meta)  -> plugin vanXone { name, command, run } yang memuat engine/plugins/<rel>.js saat dipanggil
//   • hook(list)         -> hook pasif untuk plugin ber-handler.before / handler.all (jawaban game, anti-*, dll)
//   • conn  : turunan sock (Object.create) + method gaya vanXone (reply, sendFile, getName, parseMention, ...)
//   • m     : serialize sahril + tambahan vanXone (getQuotedObj, delete, exp, limit, plugin, ...)
//   • db    : global.db.data.{users,chats,settings,...}; users DIJEMBATANI ke database vanXone (money/exp/level/limit/premium)
'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')
const crypto = require('crypto')
const { pathToFileURL } = require('url')
const baileys = require('@whiskeysockets/baileys')
const config = require('../../config')
const S = require('./core')
const udb = require('../db')
const jstore = require('../jstore')
const owners = require('../owners')
const ztowner = require('./pulse-owner')
const { userOf } = require('../utils')

const ROOT = path.join(__dirname, '..', '..', 'engine', 'lumen')
const BRAND = 'vanXone'
const PREFIXES = ['.', '!', '#', '/', '$']

// ============================================================ database (dijembatani)
const store = jstore.open('anya-db', { chats: {}, settings: {}, stats: {}, msgs: {}, blacklistUser: {}, sewa: {} })
const jidOf = (id) => `${userOf(id)}@s.whatsapp.net`

// objek user: field umum (money/exp/level/limit/bank/name) = database vanXone, premium = daftar premium vanXone.
// Field lain milik vanXone (health, potion, pet, dll.) ikut tersimpan pada objek user vanXone yang sama.
const userProxies = new Map()
function userObj(jid) {
  const id = userOf(jid)
  const base = udb.getUser(id)
  let p = userProxies.get(id)
  if (p && p.base === base) return p.proxy
  const proxy = new Proxy(base, {
    get(t, k) {
      if (k === 'premiumTime') return ztowner.isPremium(id) ? Math.max(Number(t.premiumTime) || 0, Date.now() + 86400000 * 365) : 0
      if (k === 'premium') return ztowner.isPremium(id)
      if (k === 'registered') return true
      if (k === 'banned') return !!t.banned
      return t[k]
    },
    set(t, k, v) {
      if (k === 'premiumTime') { v > 0 ? ztowner.addPrem(id) : ztowner.delPrem(id); t.premiumTime = v; return true }
      if (k === 'premium') { v ? ztowner.addPrem(id) : ztowner.delPrem(id); return true }
      t[k] = v
      return true
    }
  })
  userProxies.set(id, { base, proxy })
  return proxy
}
const usersView = new Proxy({}, {
  get: (_, k) => (typeof k === 'string' && k !== 'toJSON' && !k.startsWith('__') ? userObj(k) : undefined),
  set: () => true,
  has: () => true,
  deleteProperty: () => true,
  ownKeys: () => Object.keys(udb.all()).map(jidOf),
  getOwnPropertyDescriptor: (_, k) => ({ enumerable: true, configurable: true, value: userObj(String(k)) })
})
const dataView = new Proxy(store.data, {
  get: (t, k) => (k === 'users' ? usersView : t[k]),
  set: (t, k, v) => { if (k !== 'users') t[k] = v; return true }
})
const saveAll = () => { try { store.save(); udb.save() } catch {} }

// ============================================================ global bawaan vanXone
let booted = false
function initGlobals(sock) {
  S.initGlobals()
  if (!global.db || !global.db.__anya) {
    global.db = { __anya: true, data: dataView, write: async () => saveAll(), read: async () => dataView, save: saveAll }
  }
  if (booted) { global.mainSock = global.conn = sock; return }
  booted = true
  const num = String(config.ownerNumber || (config.owner && config.owner[0]) || '').replace(/\D/g, '')
  const g = global
  g.mainSock = g.conn = sock
  g.wm = BRAND
  g.namebot = BRAND
  if (!g.packname) g.packname = BRAND
  if (!g.author) g.author = BRAND
  g.ownerName = BRAND
  g.stickpack = config.stickerPack || BRAND
  g.stickauth = config.stickerAuthor || BRAND
  g.wait = '✨ _Wait..._'
  g.eror = '🚩 Terjadi Kesalahan...'
  g.multiplier = 38
  g.fsizedoc = 2024
  g.bootTime = g.bootTime || Date.now()
  g.self = false
  g.opts = g.opts || {}
  // global.owner milik vanXone terkunci (array nomor) → plugin vanXone membaca global.anyaOwner = [[nomor, nama, isDeveloper]]
  // dihitung ulang setiap dibaca: owner hasil .addowner / .claimowner ikut terhitung tanpa restart
  Object.defineProperty(g, 'anyaOwner', { configurable: true, enumerable: true, get: () => [[num || '0', BRAND, true]].concat((owners.all() || []).filter((x) => x && x !== num).map((x) => [String(x), BRAND, false])) })
  Object.defineProperty(g, 'mods', { configurable: true, enumerable: true, get: () => g.anyaOwner.map((o) => o[0]) })
  g.ownerNumber = num
  g.nomorown = num
  g.nomorbot = userOf(sock.user && sock.user.id) || ''
  g.panel = g.panel || (config.panel && typeof config.panel === 'object' ? config.panel : { domain: '', ptla: '', ptlc: '', egg: 15, loc: 1 })
  g.pakasir = g.pakasir || { slug: '', apikey: '', expired: 30 }
  g.autoTranslate = g.autoTranslate || { enabled: false, source: 'id', defaultLanguage: 'id', engine: 'google' }
  g.images = g.images || { ratio_16_9: { url: '', width: 1080, height: 369 }, ratio_1_1: { url: '', url_fallback: '' } }
  g.ownerInfo = g.ownerInfo || { title: BRAND, subtitle: `Developer of ${BRAND}`, secondary_subtitle: 'owner', entity_id: 0, entity_url: '' }
  g.mess = g.mess || { wait: g.wait, error: g.eror }
  g.support = g.support || {}
  g.dfail = g.dfail || (() => {})
  g.sendAdminLog = g.sendAdminLog || (async (text) => { for (const [n] of g.anyaOwner) if (n && n !== '0') await sock.sendMessage(`${n}@s.whatsapp.net`, { text: String(text) }).catch(() => {}) })
  g.getUserData = g.getUserData || ((jid) => userObj(jid))
  g.kurangiLimitGlobal = g.kurangiLimitGlobal || ((jid, n = 1) => { const u = userObj(jid); u.limit = Math.max(0, (Number(u.limit) || 0) - n); udb.save(); return u.limit })
  g.rpg = g.rpg || {
    emoticon(string) {
      string = String(string).toLowerCase()
      const emot = { level: '📊', limit: '🎫', health: '❤️', stamina: '🔋', exp: '✨', money: '💹', bank: '🏦', potion: '🥤', diamond: '💎', common: '📦', uncommon: '🛍️', mythic: '🎁', legendary: '🗃️', superior: '💼', pet: '🔖', trash: '🗑', armor: '🥼', sword: '⚔️', pickaxe: '⛏️', fishingrod: '🎣', wood: '🪵', rock: '🪨', string: '🕸️', horse: '🐴', cat: '🐱', dog: '🐶', fox: '🦊', petFood: '🍖', iron: '⛓️', gold: '🪙', emerald: '❇️', upgrader: '🧰' }
      const hit = Object.keys(emot).find((v) => new RegExp(v, 'gi').test(string))
      return hit ? emot[hit] : ''
    }
  }
  // kontak/status palsu untuk "quoted" gaya vanXone
  const fake = (text, jid = '0@s.whatsapp.net') => ({
    key: { remoteJid: 'status@broadcast', fromMe: false, id: 'VANXONE' + crypto.randomBytes(6).toString('hex').toUpperCase(), participant: jid },
    message: { extendedTextMessage: { text } }
  })
  g.fstatus = fake(BRAND)
  g.fmeta = fake(BRAND)
  g.fkontak = {
    key: { remoteJid: 'status@broadcast', fromMe: false, id: 'VANXONEKONTAK', participant: '0@s.whatsapp.net' },
    message: { contactMessage: { displayName: BRAND, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;${BRAND};;;\nFN:${BRAND}\nTEL;type=CELL;waid=0:+0\nEND:VCARD` } }
  }
  try { g.thumb = fs.readFileSync(path.join(ROOT, 'media', 'thumbnail.jpg')) } catch { g.thumb = Buffer.alloc(0) }
  g.react = g.react || (async (client, m, type) => {
    const map = { loading: '⏳', success: '✅', error: '❌', wait: '⏳', done: '✅', fail: '❌' }
    const text = map[type] || type
    try { return await (client || sock).sendMessage(m.chat || m.key.remoteJid, { react: { text, key: m.key } }) } catch { return null }
  })
  g.plugins = g.plugins || {}
}

// ============================================================ conn (turunan sock + method gaya vanXone)
const conns = new WeakMap()
const nameCache = new Map()
const groupCache = new Map()
const getBufferFrom = S.toBuffer

async function metaOf(sock, jid) {
  const hit = groupCache.get(jid)
  if (hit && Date.now() - hit.t < 60000) return hit.v
  const v = await sock.groupMetadata(jid)
  groupCache.set(jid, { t: Date.now(), v })
  return v
}

function makeConn(sock) {
  if (conns.has(sock)) return conns.get(sock)
  S.extendSock(sock)
  const conn = Object.create(sock)
  const def = (name, fn) => Object.defineProperty(conn, name, { value: fn, writable: true, configurable: true, enumerable: false })

  def('chats', {})
  def('decodeJid', (jid) => (typeof jid === 'string' ? jid.replace(/:\d+@/, '@') : jid))
  def('getJid', (jid) => (typeof jid === 'string' ? jid.replace(/:\d+@/, '@') : jid))
  def('parseMention', (text = '') => [...String(text).matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net'))
  def('getName', async (jid = '', withoutContact = false) => {
    jid = conn.decodeJid(jid)
    if (!jid) return ''
    if (jid.endsWith('@g.us')) { try { return (await metaOf(sock, jid)).subject || jid } catch { return jid } }
    if (jid === conn.decodeJid(sock.user && sock.user.id)) return (sock.user && (sock.user.name || sock.user.verifiedName)) || BRAND
    const n = nameCache.get(jid) || (udb.getUser(jid) && udb.getUser(jid).name)
    return n || userOf(jid)
  })
  def('reply', (jid, text = '', quoted, options = {}) => {
    if (Buffer.isBuffer(text)) return conn.sendFile(jid, text, 'file', '', quoted, false, options)
    const mentions = options.mentions || conn.parseMention(String(text))
    return sock.sendMessage(jid, { text: typeof text === 'string' ? text : String(text), ...options, mentions }, { quoted: quoted && quoted.key ? quoted : undefined, ...(options.ephemeralExpiration ? { ephemeralExpiration: options.ephemeralExpiration } : {}) })
  })
  def('getFile', async (src, saveToFile) => {
    let data
    let res = null
    if (Buffer.isBuffer(src)) data = src
    else if (/^data:.*?\/.*?;base64,/i.test(String(src))) data = Buffer.from(String(src).split(',')[1], 'base64')
    else if (/^https?:\/\//i.test(String(src))) {
      const r = await require('axios').get(String(src), { responseType: 'arraybuffer', timeout: 120000, headers: { 'User-Agent': S.UA } })
      res = { status: r.status }
      data = Buffer.from(r.data)
    } else if (fs.existsSync(String(src))) data = fs.readFileSync(String(src))
    else data = Buffer.alloc(0)
    const ft = (await S.fileTypeFromBuffer(data)) || { mime: 'application/octet-stream', ext: 'bin' }
    let filename
    if (saveToFile) {
      filename = path.join(os.tmpdir(), `${Date.now()}_${crypto.randomBytes(3).toString('hex')}.${ft.ext}`)
      await fs.promises.writeFile(filename, data)
    }
    return { res, filename, ...ft, data, delete: () => filename && fs.promises.unlink(filename).catch(() => {}) }
  })
  def('sendFile', async (jid, src, filename = '', caption = '', quoted, ptt = false, options = {}) => {
    const t = await conn.getFile(src)
    let { data, mime } = t
    if (!data || !data.length) throw new Error('File kosong / tidak bisa diunduh.')
    if (data.length < 65536) { try { const j = JSON.parse(data.toString()); if (j && typeof j === 'object') throw new Error(j.message || j.error || JSON.stringify(j).slice(0, 300)) } catch (e) { if (!(e instanceof SyntaxError)) throw e } }
    options = { ...options }
    const asDoc = options.asDocument
    const asSticker = options.asSticker
    delete options.asDocument; delete options.asSticker; delete options.asImage; delete options.asVideo; delete options.asLocation
    const opt = quoted && quoted.key ? { quoted } : {}
    let content
    if (/webp/.test(mime) || (/image/.test(mime) && asSticker)) content = { sticker: data }
    else if (/image/.test(mime)) content = { image: data, caption }
    else if (/video/.test(mime)) content = { video: data, caption }
    else if (/audio/.test(mime) || ptt) content = { audio: data, mimetype: options.mimetype || (ptt ? 'audio/ogg; codecs=opus' : mime.startsWith('audio') ? mime : 'audio/mpeg'), ptt: !!ptt }
    else content = { document: data, mimetype: options.mimetype || mime, fileName: filename || `file.${t.ext}`, caption }
    if (asDoc) content = { document: data, mimetype: options.mimetype || mime, fileName: filename || `file.${t.ext}`, caption }
    return sock.sendMessage(jid, { ...options, ...content }, { ...opt })
  })
  def('sendSticker', async (jid, src, quoted, options = {}) => sock.sendImageAsSticker(jid, src, quoted && quoted.key ? quoted : undefined, options))
  def('sendMedia', (jid, src, quoted, options = {}) => conn.sendFile(jid, src, '', options.caption || '', quoted, false, options))
  def('downloadM', async (m) => {
    const q = m && m.download ? m : null
    if (q) return q.download()
    const mt = (m && (m.mediaType || m.mtype || '')).replace('Message', '')
    const stream = await baileys.downloadContentFromMessage(m.msg || m, mt)
    const chunks = []
    for await (const c of stream) chunks.push(c)
    return Buffer.concat(chunks)
  })
  def('sendContact', (jid, name, number, quoted) => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;type=CELL;waid=${number}:+${number}\nEND:VCARD`
    return sock.sendMessage(jid, { contacts: { displayName: name, contacts: [{ vcard }] } }, { quoted: quoted && quoted.key ? quoted : undefined })
  })
  def('copyNForward', async (jid, message, forwardingScore = true, options = {}) => {
    const content = baileys.generateForwardMessageContent ? await baileys.generateForwardMessageContent(message, forwardingScore) : message.message
    const type = Object.keys(content)[0]
    const msg = baileys.generateWAMessageFromContent(jid, content, { ...options, userJid: sock.user.id })
    await sock.relayMessage(jid, msg.message, { messageId: msg.key.id })
    return msg
  })
  def('serializeM', (m) => m)
  def('pushMessage', () => {})
  def('sendPresenceUpdate', (...a) => sock.sendPresenceUpdate(...a).catch(() => {}))
  conns.set(sock, conn)
  return conn
}

// ============================================================ m (pesan gaya vanXone)
function makeM(sock, conn, ctx) {
  const { msg, from, sender, isGroup, body } = ctx
  const reply = (text, chatId, options = {}) => conn.reply(chatId || from, text, msg, options)
  const m = S.serialize(sock, msg, { from, sender, isGroup, body, reply })
  m.exp = 0
  m.limit = false
  m.isCommand = true
  m.mentionedJid = m.mentionedJid || []
  m.reply = (text, chatId, options = {}) => conn.reply(chatId || from, text, msg, options)
  m.delete = () => sock.sendMessage(from, { delete: msg.key }).catch(() => {})
  m.copy = () => m
  m.getQuotedObj = async () => (m.quoted ? { key: m.quoted.key, message: m.quoted.fakeObj ? m.quoted.fakeObj.message : m.quoted.message, ...m.quoted } : null)
  m.sendMessage = (jid, content, options = {}) => sock.sendMessage(jid, content, options)
  m.conn = conn
  m.isOwner = ctx.isOwner
  m.participant = msg.key.participant || undefined
  m.senderPn = msg.key.participantPn || msg.key.senderPn || undefined
  m.messageStubType = msg.messageStubType
  m.messageStubParameters = msg.messageStubParameters
  if (m.quoted) {
    const q = m.quoted
    q.vM = q.fakeObj
    q.fromMe = !!(q.key && q.key.fromMe)
    q.mediaMessage = q.mediaMessage || (/image|video|audio|sticker|document/i.test(q.mtype || '') ? q.message : null)
    q.fileSha = (q.msg && q.msg.fileSha256 && Buffer.from(q.msg.fileSha256).toString('base64')) || ''
    q.delete = () => sock.sendMessage(from, { delete: q.key }).catch(() => {})
  }
  m.fakeObj = msg
  return m
}

// ============================================================ memuat plugin vanXone (ESM) — di-cache
const modCache = new Map()
async function load(rel) {
  if (modCache.has(rel)) return modCache.get(rel)
  const file = path.join(ROOT, 'plugins', rel + '.js')
  const p = import(pathToFileURL(file).href).then((mod) => mod.default || mod).catch((err) => { modCache.delete(rel); throw err })
  modCache.set(rel, p)
  return p
}

// ============================================================ parameter "extra" gaya handler vanXone
async function buildExtra(sock, conn, m, ctx, handler, rel) {
  const { from, sender, isGroup, isOwner } = ctx
  initGlobals(sock)
  // pastikan data dasar chat/user ada (seperti handler.js vanXone)
  const chat = (store.data.chats[from] ||= {})
  userObj(sender)
  const botJid = conn.decodeJid(sock.user && sock.user.id)
  store.data.settings[botJid] ||= {}
  let participants = []
  let groupMetadata = {}
  let isAdmin = false
  let isRAdmin = false
  let isBotAdmin = false
  let groupUser = {}
  let bot = {}
  if (isGroup) {
    try {
      groupMetadata = ctx.groupMetadata || (await metaOf(sock, from)) || {}
      participants = groupMetadata.participants || []
      const same = (a, b) => userOf(a) === userOf(b)
      const pid = (p) => p.phoneNumber || p.jid || p.id
      groupUser = participants.find((p) => same(pid(p), sender) || same(p.id, sender) || same(p.lid, sender)) || {}
      bot = participants.find((p) => same(pid(p), botJid) || same(p.id, botJid) || same(p.lid, sock.user && sock.user.lid)) || {}
      isRAdmin = groupUser.admin === 'superadmin'
      isAdmin = isRAdmin || groupUser.admin === 'admin'
      isBotAdmin = !!(bot && bot.admin)
    } catch { /* grup tidak terbaca → anggap bukan admin */ }
  }
  // di vanXone tidak ada tingkat "developer" khusus: siapa pun yang owner bot (settings.js / .addowner / .claimowner) lolos
  const isROwner = !!isOwner
  const isPrems = isOwner || ztowner.isPremium(sender)
  m.isAdmin = isAdmin
  m.isSuperAdmin = isRAdmin
  m.isROwner = isROwner
  return {
    match: null,
    conn, sock: conn, client: conn,
    participants, groupMetadata, user: groupUser, bot,
    isROwner, isOwner: !!isOwner, isPemilik: !!isOwner, isRAdmin, isAdmin, isBotAdmin, isPrems, isMods: !!isOwner,
    chatUpdate: { messages: [ctx.msg] },
    __dirname: path.join(ROOT, 'plugins', path.dirname(rel)),
    __filename: path.join(ROOT, 'plugins', rel + '.js'),
    reply: (t, chatId, o) => m.reply(t, chatId, o),
    chat, setting: store.data.settings[botJid], db: global.db
  }
}

// kegagalan izin: pesan bergaya vanXone
const FAIL = {
  rowner: 'Perintah ini hanya untuk developer bot.',
  owner: config.mess.only.owner,
  mods: 'Perintah ini hanya untuk moderator.',
  premium: 'Fitur ini khusus pengguna premium.',
  group: config.mess.only.group,
  private: 'Perintah ini hanya bisa dipakai di chat pribadi.',
  admin: config.mess.only.admin,
  botAdmin: config.mess.only.badmin
}

// ============================================================ pembungkus plugin
function plugin(rel, meta = {}) {
  const cmds = [...new Set([].concat(meta.command || []).map((c) => String(c).toLowerCase()))]
  global.uiPlain = [...new Set([...(global.uiPlain || []), ...cmds])]
  return {
    name: meta.name || cmds[0] || path.basename(rel),
    command: cmds,
    category: meta.category || 'tools',
    desc: meta.desc || `Fitur ${cmds[0] || rel}`,
    usage: meta.usage || '',
    owner: !!meta.owner,
    group: !!meta.group,
    admin: !!meta.admin,
    botAdmin: !!meta.botAdmin,
    selfReact: true,
    needsInfo: !!(meta.group || meta.admin || meta.botAdmin),
    run: async (ctx) => {
      const { sock, from, sender, isGroup, isOwner } = ctx
      initGlobals(sock)
      let handler
      try { handler = await load(rel) } catch (err) {
        const miss = /Cannot find (?:package|module) '([^']+)'/.exec(err.message)
        console.log(`[ANYA] gagal memuat ${rel}:`, err.message)
        return ctx.reply(miss ? `Fitur ini butuh modul "${miss[1]}". Jalankan: npm install ${miss[1]}` : `Fitur belum bisa dimuat: ${err.message.slice(0, 160)}`)
      }
      if (typeof handler !== 'function') return ctx.reply('Plugin tidak valid.')
      const conn = makeConn(sock)
      const m = makeM(sock, conn, ctx)
      const usedPrefix = PREFIXES.includes((ctx.body || '')[0]) ? ctx.body[0] : (ctx.prefix || '.')
      const extra = await buildExtra(sock, conn, m, ctx, handler, rel)
      // izin sesuai flag handler vanXone
      if (handler.rowner && !extra.isROwner) return ctx.reply(FAIL.rowner)
      if (handler.owner && !isOwner) return ctx.reply(FAIL.owner)
      if (handler.mods && !isOwner) return ctx.reply(FAIL.mods)
      if (handler.premium && !extra.isPrems) return ctx.reply(FAIL.premium)
      if (handler.group && !isGroup) return ctx.reply(FAIL.group)
      if (handler.private && isGroup) return ctx.reply(FAIL.private)
      if (handler.botAdmin && !extra.isBotAdmin) return ctx.reply(FAIL.botAdmin)
      if (handler.admin && !extra.isAdmin && !isOwner) return ctx.reply(FAIL.admin)
      const cost = handler.limit ? (Number(handler.limit) > 1 ? Number(handler.limit) : 1) : 0
      if (cost && !extra.isPrems) {
        const u = userObj(sender)
        if ((Number(u.limit) || 0) < cost) return ctx.reply(`Limit kamu tidak cukup (butuh ${cost}, sisa ${Number(u.limit) || 0}). Beli limit dengan ${usedPrefix}buylimit.`)
      }
      const command = String(ctx.command || '').toLowerCase()
      const args = ctx.args || []
      const noPrefix = (ctx.body || '').slice(usedPrefix.length)
      Object.assign(extra, { usedPrefix, noPrefix, _args: args, args, command, text: ctx.text })
      try {
        await handler.call(conn, m, extra)
        if (cost && !extra.isPrems) { const u = userObj(sender); u.limit = Math.max(0, (Number(u.limit) || 0) - cost) }
        if (m.exp) { try { udb.addExp(sender, Number(m.exp) || 0) } catch {} }
      } catch (err) {
        console.log(`[ANYA] ${rel}:`, err && err.stack ? err.stack.split('\n').slice(0, 4).join('\n') : err)
        const msgText = err && (err.message || err.msg || (typeof err === 'string' ? err : '')) || 'tidak diketahui'
        try { await ctx.reply(`❌ Terjadi kesalahan: ${String(msgText).slice(0, 300)}`) } catch {}
      } finally {
        saveAll()
      }
    }
  }
}

// ============================================================ hook pasif (handler.before / handler.all)
const hookFail = new Map()
function hook(list) {
  return {
    name: 'anya-hooks',
    hook: true,
    passive: async (hc) => {
      const { sock, msg, from, sender, isGroup, body, isOwner } = hc
      if (!list.length || msg.key.fromMe && !body) return false
      initGlobals(sock)
      const conn = makeConn(sock)
      let m = null
      for (const rel of list) {
        let h
        // modul yang gagal dimuat (mis. paket npm belum terpasang) tidak dicoba lagi selama 10 menit agar tidak membebani tiap pesan
        if (hookFail.get(rel) > Date.now()) continue
        try { h = await load(rel) } catch { hookFail.set(rel, Date.now() + 600000); continue }
        if (!h || (typeof h.before !== 'function' && typeof h.all !== 'function')) continue
        if (!m) {
          const reply = (text, chatId, options = {}) => conn.reply(chatId || from, text, msg, options)
          m = makeM(sock, conn, { msg, from, sender, isGroup, body, isOwner })
          m.isCommand = PREFIXES.includes((body || '')[0])
          m.reply = reply
        }
        try {
          const extra = await buildExtra(sock, conn, m, { msg, from, sender, isGroup, isOwner, groupMetadata: null }, h, rel)
          Object.assign(extra, { usedPrefix: (body || '')[0] || '.', text: body || '', args: (body || '').split(/\s+/).slice(1), command: ((body || '').split(/\s+/)[0] || '').replace(/^[.!#/$]/, '').toLowerCase() })
          if (typeof h.all === 'function') await h.all.call(conn, m, extra)
          // Di vanXone, nilai balik `before` hanya melewati perintah plugin itu sendiri (return true = "bukan urusanku"),
          // bukan menghentikan pesan. Jadi hasilnya diabaikan dan pesan tetap diteruskan ke perintah lain.
          if (typeof h.before === 'function') await h.before.call(conn, m, extra)
        } catch (err) {
          console.log(`[ANYA:hook] ${rel}:`, err && err.message)
        }
      }
      saveAll()
      return false
    }
  }
}

const tag = require('./rank')
module.exports = { plugin: tag(3, plugin), hook: tag(3, hook), load, makeConn, makeM, initGlobals, userObj, store, saveAll, ROOT, BRAND }
