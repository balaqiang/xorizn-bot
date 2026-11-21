// =====================================================================
//  lib/runtime.js — menjalankan plugin vanXone di bawah core bot (pengganti bot.js asli).
//
//  Core yang mengurus koneksi, parse perintah & izin dasar (owner/grup/admin). File ini hanya:
//   - memuat plugin & hook vanXone (sama seperti bot.js asli),
//   - menyiapkan "sock" khusus vanXone (UI kartu, format, tombol) tanpa mengubah sock utama,
//   - menjalankan alur pasif vanXone (anti-spam, grouptools, game tanpa prefix, dll),
//   - mengeksekusi plugin dengan ctx yang sama seperti versi aslinya.
//  Auto-join saluran/grup milik pembuat vanXone (lib/autojoin.js) TIDAK dijalankan.
// =====================================================================
'use strict'

const fs = require('fs')
const path = require('path')

const pluginDir = path.join(__dirname, '..', 'plugins')
// subfolder plugin dengan format lain (dimuat oleh loader core, bukan oleh runtime vanXone)
const FOREIGN_DIRS = new Set(['core', 'rubby'])
const plugins = new Map()
const hooks = []
const socks = new WeakMap()
let config = null
let settings = null

const WAIT_RE = /^\s*(⏳|⌛|🔎|🔬)|^\s*(Mengunduh|Mencari|Membuat|Menguji|Mengirim|Memproses|Menghitung|Menyiapkan|Masuk antrian)/i
const FAIL_RE = /^\s*(❌|⚠️)|gagal|tidak ditemukan|tidak bisa|tidak valid|\berror\b|ditolak|kesalahan/i

function init() {
  config = require('../config')
  global.__vanPlugins = () => [...new Set(plugins.values())]
  const settingsFile = path.join(__dirname, '..', 'database', 'runtime-settings.json')
  settings = { mode: 'public' }
  try { Object.assign(settings, JSON.parse(fs.readFileSync(settingsFile, 'utf8'))) } catch {}
  settings.__save = () => { try { fs.writeFileSync(settingsFile, JSON.stringify({ ...settings, __save: undefined }, null, 2)) } catch {} }
  return config
}

function walk(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    if (dir === pluginDir && FOREIGN_DIRS.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else if (entry.name.endsWith('.js')) out.push(full)
  }
  return out
}

function loadPlugins() {
  plugins.clear()
  hooks.length = 0
  const result = { loaded: 0, failed: [] }
  const cats = require('./categories')
  const found = []
  for (const full of walk(pluginDir).sort()) {
    const file = path.relative(pluginDir, full)
    try {
      delete require.cache[require.resolve(full)]
      const plugin = require(full)
      if (plugin && plugin.hook === true && (plugin.passive || plugin.onParticipants || plugin.init)) {
        found.push({ file, full, plugin, hook: true })
        continue
      }
      if (!plugin || typeof plugin.run !== 'function' || !plugin.command) {
        result.failed.push({ file, error: 'format salah (butuh run & command)' })
        continue
      }
      plugin.category = cats.canon(plugin.category)
      found.push({ file, full, plugin, hook: false })
    } catch (err) {
      result.failed.push({ file, error: err.message })
    }
  }
  // fitur asli vanXone menang atas fitur hasil porting engine/ (plugin.__ported)
  found.sort((a, b) => (a.plugin.__ported || 0) - (b.plugin.__ported || 0) || (a.file < b.file ? -1 : 1))
  for (const { file, full, plugin, hook } of found) {
    if (hook) {
      hooks.push(plugin)
      result.loaded++
      continue
    }
    Object.defineProperty(plugin, '__file', { value: full, enumerable: false, configurable: true, writable: true })
    let cmds = [].concat(plugin.command).map((c) => String(c).toLowerCase())
    if (plugin.__ported) {
      cmds = cmds.filter((c) => !plugins.has(c))
      if (!cmds.length) { result.loaded++; continue }
      plugin.command = cmds
    }
    for (const cmd of cmds) if (!plugins.has(cmd)) plugins.set(cmd, plugin)
    result.loaded++
  }
  return result
}

const list = () => [...new Set(plugins.values())]
const hookList = () => hooks.slice()

/** Sock khusus vanXone: objek turunan sock utama + lapisan UI vanXone (tidak memengaruhi pack lain). */
async function prepareSock(real) {
  if (socks.has(real)) return socks.get(real)
  const sock = Object.create(real)
  sock.__rawSend = real.sendMessage.bind(real)
  try {
    require('./richui').install(sock, config)
    global.__mess = config.mess
    global.__prefix = config.prefix
    require('./fmt').install(sock)
    await require('./engine/pulse-send').install(sock)
  } catch (err) {
    console.log('[VANXONE] gagal memasang lapisan UI:', err.message)
  }
  socks.set(real, sock)
  return sock
}

const isOwnerFor = (msg, sender, core) => {
  const owners = require('./owners')
  return !!(core && core.isOwner) || !!msg.key.fromMe || owners.isOwner(sender) || owners.isOwnerMsg(msg)
}

function senderOf(sock, msg) {
  const from = msg.key.remoteJid
  const isGroup = from.endsWith('@g.us')
  return isGroup ? msg.key.participant || msg.participant : msg.key.fromMe ? sock.user.id : from
}

/**
 * Alur pasif vanXone untuk setiap pesan. Return true = pesan sudah ditangani (core berhenti).
 * @param {object} real  sock utama
 * @param {object} msg   WAMessage mentah
 * @param {object} core  { isOwner, body, dispatch(body) }
 */
async function passive(real, msg, core = {}) {
  const sock = await prepareSock(real)
  const from = msg.key.remoteJid
  const isGroup = from.endsWith('@g.us')
  const sender = senderOf(sock, msg)
  let body = String(core.body || '').trim()
  const isOwner = isOwnerFor(msg, sender, core)

  // Balasan angka/kata ke kartu interaktif vanXone → jalankan perintah tujuannya
  if (body && !(core.prefixes || [config.prefix]).some((p) => body.startsWith(p))) {
    try {
      const viaReply = require('./cardreply').resolve(msg, body)
      if (viaReply && typeof core.dispatch === 'function') {
        await core.dispatch(viaReply)
        return true
      }
    } catch {}
  }

  if (isGroup && !msg.key.fromMe && sender) {
    try { require('./activity').count(from, sender) } catch {}
  }

  try {
    if (await require('./grouptools').observe(sock, msg, { from, sender, isGroup, body, prefix: config.prefix })) return true
  } catch (err) { console.log('[GROUPTOOLS]', err.message) }

  const { handleAntiLink } = require('./antilink')
  const { handleAfk, handleBadWord } = require('./guard')
  if (isGroup && !msg.key.fromMe && (await handleAntiLink(sock, msg, { from, sender, body, isOwner }))) return true
  if (isGroup && !msg.key.fromMe && (await handleBadWord(sock, msg, { from, sender, body, isOwner }))) return true
  if (!msg.key.fromMe) await handleAfk(sock, msg, { from, sender, body, prefix: config.prefix })

  const antispam = require('./antispam')
  if (isGroup && !msg.key.fromMe && sender && antispam.enabled(from) && !isOwner) {
    const hit = antispam.check(from, sender, msg.key)
    if (hit) {
      const { getGroupInfo, userOf } = require('./utils')
      const info = await getGroupInfo(sock, from, sender)
      if (!info.isAdmin) {
        if (info.isBotAdmin) for (const k of hit.keys) sock.sendMessage(from, { delete: k }).catch(() => {})
        if (hit.warn) await sock.sendMessage(from, { text: `🚫 @${userOf(sender)} terdeteksi spam (pesan beruntun). Mohon kirim pesan dengan wajar.`, mentions: [sender] })
        return true
      }
    }
  }

  if (hooks.length) {
    const hookCtx = { sock, msg, from, sender, isGroup, body, prefix: config.prefix, config, settings, isOwner }
    for (const h of hooks) {
      if (typeof h.passive !== 'function') continue
      try { if (await h.passive(hookCtx)) return true } catch (err) { console.log('[HOOK] passive', h.name, err.message) }
    }
  }
  return false
}

/** Jalankan satu plugin vanXone. `core` = konteks dari core (args, text, command, prefix, isAdmin, ...). */
async function execute(plugin, real, msg, core) {
  const sock = await prepareSock(real)
  const from = msg.key.remoteJid
  const isGroup = from.endsWith('@g.us')
  const sender = senderOf(sock, msg)
  const isOwner = isOwnerFor(msg, sender, core)
  const engineCore = require('./engine/core')

  if (engineCore.regisBlock(sender, isOwner, core.command)) {
    return sock.sendMessage(from, { text: `Kamu belum terdaftar. Ketik *${core.prefix || config.prefix}daftar* dulu untuk memakai bot.` }, { quoted: msg })
  }
  const { isBanned, isMutedFor } = require('./guard')
  if (!isOwner && isBanned(sender)) return
  if (isGroup && !isOwner && (await isMutedFor(sock, { from, sender, command: core.command }))) return

  const body = `${core.prefix || ''}${core.command}${core.text ? ' ' + core.text : ''}`
  const ctx = {
    sock,
    msg,
    from,
    sender,
    isGroup,
    isOwner,
    body,
    args: core.args || [],
    text: core.text || '',
    command: core.command,
    prefix: core.prefix || config.prefix,
    config,
    settings,
    saveSettings: () => settings.__save(),
    plugins: list(),
    reloadPlugins: loadPlugins,
    groupMetadata: core.groupMetadata,
    isAdmin: !!core.isAdmin,
    isBotAdmin: !!core.isBotAdmin
  }

  const state = { waiting: false, failed: false }
  const react = (emoji) => sock.sendMessage(from, { react: { text: emoji, key: msg.key } }).catch(() => {})
  ctx.react = (emoji = '⏳') => {
    if (emoji === '⏳') {
      if (state.waiting) return Promise.resolve()
      state.waiting = true
    }
    return react(emoji)
  }
  ctx.reply = (text) => {
    const t = String(text)
    if (WAIT_RE.test(t)) return ctx.react('⏳')
    if (state.waiting && FAIL_RE.test(t.slice(0, 120))) state.failed = true
    return sock.sendMessage(from, { text }, { quoted: msg })
  }
  const slowTimer = plugin.selfReact ? null : setTimeout(() => ctx.react('⏳'), 1200)

  try { require('./cmdstats').hit(plugin.name || core.command, sender) } catch {}
  try {
    const player = require('./db').addExp(sender, 10)
    if (msg.pushName) player.name = msg.pushName
  } catch {}

  try {
    const names = [].concat(plugin.command).map((c) => String(c).toLowerCase())
    const richui = require('./richui')
    await richui.run(
      {
        t0: Date.now(), name: msg.pushName || '', number: String(sender || '').split('@')[0].split(':')[0], category: plugin.category, command: core.command, body,
        title: String(plugin.name || core.command).replace(/[-_]+/g, ' '), icon: require('./menuicons').cmdIcon(plugin, plugin.category),
        plain: names.some((n) => richui.OPTS.plain.has(n)),
        desc: plugin.desc || '', usage: plugin.usage || '', aliases: names, isGroup, isOwner,
        owner: !!plugin.owner, admin: !!plugin.admin, group: !!plugin.group, botAdmin: !!plugin.botAdmin,
        groupName: ctx.groupMetadata?.subject || ''
      },
      () => plugin.run(ctx)
    )
    clearTimeout(slowTimer)
    if (state.waiting) await react(state.failed ? '❌' : '✅')
  } catch (err) {
    clearTimeout(slowTimer)
    if (state.waiting) await react('❌')
    throw err
  }
}

async function onParticipants(real, ev) {
  const sock = await prepareSock(real)
  try { await require('./groups').handleParticipants(sock, ev) } catch (err) { console.log('[VANXONE] welcome/leave:', err.message) }
  for (const h of hooks) {
    if (typeof h.onParticipants !== 'function') continue
    try { await h.onParticipants(sock, ev) } catch (err) { console.log('[HOOK] onParticipants', h.name, err.message) }
  }
}

async function onOpen(real) {
  const sock = await prepareSock(real)
  try { require('./scheduler').startScheduler(sock) } catch (err) { console.log('[VANXONE] scheduler:', err.message) }
  for (const h of hooks) {
    if (typeof h.init !== 'function') continue
    Promise.resolve().then(() => h.init(sock)).catch((err) => console.log('[HOOK] init', h.name, err.message))
  }
}

module.exports = { init, loadPlugins, list, hookList, passive, execute, onParticipants, onOpen, prepareSock }
