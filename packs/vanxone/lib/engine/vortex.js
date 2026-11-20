// lib/kilua2.js — adapter untuk plugin hasil port Kilua_MD_By_Naren (gaya `conn`/ygg,
// handler(m, { conn, text, args, command })). Kode asli disimpan utuh di engine/plugins/**,
// masih dalam bentuk `module.exports = async (__naren_imp, __naren_meta) => { ...kode asli... }`
// supaya tidak perlu ditulis ulang manual; __naren_imp di sini diisi ulang supaya resolve ke
// Node asli (built-in / npm) atau ke file lokal di engine/lib/.
'use strict'

const fs = require('fs')
const path = require('path')
const ourin = require('./nimbus')
const ztowner = require('./pulse-owner')
const dbshim = require('./vortex-dbshim')

const ROOT = path.join(__dirname, '..', '..', 'engine', 'vortex')
const gameState = {}
const GAME_KEYS = ['game', 'jbRooms', 'jbVotes', 'tebakbuah', 'tebakbenda', 'caklontong', 'skata', 'hangman', 'tebakKata', 'bomb', 'suit', 'tebaklagu', 'tictactoe', 'sambungkata']

async function __naren_imp(spec) {
  if (spec.startsWith('./') || spec.startsWith('../')) {
    const file = path.join(ROOT, 'lib', spec.replace(/^\.\//, ''))
    const mod = require(file)
    return typeof mod === 'function' ? await mod(__naren_imp, {}) : mod
  }
  return require(spec)
}

function buildConn(sock) {
  if (sock.__kiluaConn) return sock.__kiluaConn
  ourin.extend(sock)
  const conn = Object.create(sock)
  conn.user = sock.user
  conn.getName = (jid) => { try { return sock.contacts?.[jid]?.name || sock.contacts?.[jid]?.notify || jid.split('@')[0] } catch { return jid } }
  conn.decodeJid = (jid) => String(jid || '')
  conn.getFile = async (pathOrBuf, saveToFile = false) => {
    let data
    if (Buffer.isBuffer(pathOrBuf)) data = pathOrBuf
    else if (/^https?:\/\//.test(pathOrBuf)) { const r = await fetch(pathOrBuf); data = Buffer.from(await r.arrayBuffer()) }
    else if (fs.existsSync(pathOrBuf)) data = fs.readFileSync(pathOrBuf)
    else data = Buffer.alloc(0)
    let mime = 'application/octet-stream', ext = 'bin'
    try { const { fileTypeFromBuffer } = await import('file-type'); const t = await fileTypeFromBuffer(data); if (t) { mime = t.mime; ext = t.ext } } catch {}
    let filename = pathOrBuf
    if (saveToFile && !fs.existsSync(String(pathOrBuf))) {
      filename = path.join(require('os').tmpdir(), Date.now() + '.' + ext)
      fs.writeFileSync(filename, data)
    }
    return { data, mime, ext, filename, res: { status: 200 } }
  }
  conn.reply = (jid, text = '', quoted, options = {}) => Buffer.isBuffer(text)
    ? conn.sendFile(jid, text, 'file', '', quoted, false, options)
    : sock.sendMessage(jid, { text, ...options }, { quoted })
  conn.sendFile = async (jid, filePath, filename = '', caption = '', quoted, ptt = false, options = {}) => {
    const { data, mime } = await conn.getFile(filePath, true)
    let mtype = 'document'
    if (/^image/.test(mime)) mtype = 'image'
    else if (/^video/.test(mime)) mtype = 'video'
    else if (/^audio/.test(mime)) mtype = 'audio'
    return sock.sendMessage(jid, { [mtype]: data, caption, ptt, mimetype: options.mimetype || mime, fileName: filename || undefined, ...options }, { quoted })
  }
  conn.sendSticker = async (jid, filePath, m, options = {}) => {
    const { data } = await conn.getFile(filePath)
    return sock.sendMessage(jid, { sticker: data }, { quoted: m })
  }
  for (const k of GAME_KEYS) { gameState[k] = gameState[k] || {}; Object.defineProperty(conn, k, { get: () => gameState[k], set: (v) => { gameState[k] = v } }) }
  sock.__kiluaConn = conn
  return conn
}

function plugin(rel, meta) {
  const cmds = [...new Set(meta.command.map((c) => String(c).toLowerCase()))]
  global.uiPlain = [...new Set([...(global.uiPlain || []), ...cmds])]
  return {
    name: meta.name || cmds[0],
    command: cmds,
    category: meta.category || 'tools',
    desc: meta.desc || `Perintah ${cmds[0]}`,
    usage: meta.usage || '',
    owner: !!meta.owner,
    group: !!meta.group,
    admin: !!meta.admin,
    botAdmin: !!meta.botAdmin,
    selfReact: true,
    run: async (ctx) => {
      const { sock, msg, from, sender, isOwner } = ctx
      const conn = buildConn(sock)
      const reply = (text, chatId, options = {}) => sock.sendMessage(chatId || from, { text }, { quoted: msg, ...options })

      if (meta.premium && !isOwner && !ztowner.isPremium(sender)) return reply('Fitur ini khusus user premium.')
      if (meta.group && !ctx.isGroup) return reply('Fitur ini hanya bisa dipakai di dalam grup.')

      let wrapped
      try {
        wrapped = require(path.join(ROOT, 'plugins', rel + '.js'))
      } catch (err) {
        console.log('[KILUA2] gagal memuat', rel, err.message)
        return reply(`Fitur gagal dimuat: ${err.message}`)
      }
      let mod
      try {
        mod = await wrapped(__naren_imp, {})
      } catch (err) {
        console.log(`[KILUA2:${meta.name}] init error:`, err.message)
        const pkg = /Cannot find module '([^']+)'/.exec(err.message)
        return reply(pkg ? `Dependensi *${pkg[1]}* belum terpasang. Owner: jalankan \`npm install ${pkg[1]}\` lalu restart bot.` : `Fitur gagal dimuat: ${err.message}`)
      }
      const handler = mod.default || mod.handler
      if (typeof handler !== 'function') return reply('Fitur ini tidak punya handler.')

      const m = ourin.buildM(sock, ctx, reply)
      m.isOwner = !!isOwner
      m.isPremium = !!isOwner || !!ztowner.isPremium(sender)
      m.isAdmin = !!ctx.isAdmin
      m.isBotAdmin = !!ctx.isBotAdmin
      m.isGroup = !!ctx.isGroup
      m.mentionedJid = m.mentions || []
      dbshim.ensureUser(sender)
      dbshim.ensureChat(from)

      try {
        await handler(m, { conn, sock, text: ctx.text, args: ctx.args, command: ctx.command, usedPrefix: m.prefix, isOwner, isAdmin: ctx.isAdmin, isBotAdmin: ctx.isBotAdmin, isGroup: ctx.isGroup, groupMetadata: ctx.groupMetadata })
      } catch (err) {
        console.log(`[KILUA2:${meta.name}]`, err.message)
        if (isOwner) await reply(`🔧 *Detail error (khusus owner)*\n\nFitur: ${meta.name}\nPenyebab: ${err.message}`).catch(() => {})
      }
    }
  }
}

const tag = require('./rank')
module.exports = { plugin: tag(7, plugin), ROOT }
