// lib/portkit.js — adapter generik untuk paket hasil port yang formatnya SAMA dengan vanXone
// (pluginConfig + handler(m, { sock, text, args, command, prefix })). Dipakai oleh lib/vemzo.js,
// lib/rimuru2.js, lib/hoshino2.js. Fungsi sock tambahan (sendMedia/sendButton/stiker dst.) dan
// pembentukan objek m dipakai bersama dari lib/ourin.js (sock yang sama, jadi aman dipakai lintas paket).
'use strict'

const fs = require('fs')
const path = require('path')
const { pathToFileURL } = require('url')
const ourin = require('./nimbus')
const ztowner = require('./pulse-owner')

function makeAdapter(packName, rank = 9) {
  const ROOT = path.join(__dirname, '..', '..', 'engine', packName)
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

  const cooldowns = new Map()
  function preflight(meta, ctx) {
    const { isOwner, isGroup, sender } = ctx
    if (meta.private && isGroup) return 'Fitur ini hanya bisa dipakai di chat pribadi bot.'
    if (meta.premium && !isOwner && !ztowner.isPremium(sender)) return 'Fitur ini khusus user premium.'
    for (const k of (meta.needs && meta.needs.apikeys) || []) {
      if (!(global.apiKeys && global.apiKeys[k])) {
        return `Fitur ini butuh apikey *${k}* yang belum diisi.\nOwner: isi \`global.apiKeys.${k}\` di settings.js lalu restart bot.`
      }
    }
    if (meta.cooldown && !isOwner) {
      const k = `${packName}:${meta.name}:${sender}`
      const last = cooldowns.get(k) || 0
      const wait = meta.cooldown * 1000 - (Date.now() - last)
      if (wait > 0) return `Tunggu ${Math.ceil(wait / 1000)} detik lagi sebelum memakai perintah ini.`
    }
    return null
  }

  function plugin(rel, meta) {
    const cmds = [...new Set(meta.command.map((c) => String(c).toLowerCase()))]
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
      selfReact: true,
      run: async (ctx) => {
        const { sock, msg, from, sender, isOwner } = ctx
        ourin.extend(sock)
        const quotedOpt = { quoted: msg }
        const reply = (text, chatId, options = {}) => sock.sendMessage(chatId || from, { text: typeof text === 'string' ? text : String(text), ...options }, quotedOpt)

        const block = preflight(meta, ctx)
        if (block) return reply(block)

        let mod
        try {
          mod = await loadPlugin(rel)
        } catch (err) {
          console.log(`[${packName.toUpperCase()}] gagal memuat ${rel}:`, err.message)
          const pkg = /Cannot find (?:package|module) '([^']+)'/.exec(err.message)
          return reply(pkg ? `Dependensi *${pkg[1]}* belum terpasang. Owner: jalankan \`npm install\` lalu restart bot.` : `Fitur gagal dimuat: ${err.message}`)
        }
        if (typeof mod.handler !== 'function') return reply('Fitur ini tidak punya handler.')

        if (meta.cooldown) cooldowns.set(`${packName}:${meta.name}:${sender}`, Date.now())

        const m = ourin.buildM(sock, ctx, reply)
        m.isOwner = !!isOwner
        m.isPremium = !!isOwner || !!ztowner.isPremium(sender)
        m.isAdmin = !!ctx.isAdmin
        m.isBotAdmin = !!ctx.isBotAdmin
        m.isGroup = !!ctx.isGroup
        m.isBanned = false
        m.hasQuotedMedia = !!(m.quoted && m.quoted.isMedia)

        const params = {
          sock, m, msg, text: ctx.text, args: ctx.args, command: ctx.command, usedPrefix: m.prefix, prefix: m.prefix, reply,
          isOwner, isGroup: ctx.isGroup, isAdmin: ctx.isAdmin, isBotAdmin: ctx.isBotAdmin, groupMetadata: ctx.groupMetadata
        }
        try {
          await mod.handler(m, params)
        } catch (err) {
          console.log(`[${packName.toUpperCase()}:${meta.name}]`, err.message)
          if (isOwner) await reply(`🔧 *Detail error (khusus owner)*\n\nFitur: ${meta.name}\nPenyebab: ${err.message}`).catch(() => {})
        }
      }
    }
  }

  const tag = require('./rank')
  return { plugin: tag(rank, plugin), loadPlugin, ROOT }
}

module.exports = makeAdapter
