// lib/anya_group.js — state & util bersama untuk fitur grup tambahan (anti-tag, bungkam, blacklist, intro, dll)
'use strict'
const { open } = require('../jstore')
const { userOf, isBot } = require('../utils')

const st = open('anyagroup', { g: {} })
const G = (jid) => (st.data.g[jid] ||= { antitagall: false, antitagsw: false, antivirtex: false, adminonly: false, muted: [], blacklist: [], intro: '', promoteText: '', demoteText: '', pin: '' })

// cache metadata admin (60 detik) supaya hook ringan
const cache = new Map()
async function admins(sock, from) {
  const c = cache.get(from)
  if (c && Date.now() - c.at < 60000) return c
  const md = await sock.groupMetadata(from)
  const list = md.participants.filter((p) => p.admin).map((p) => userOf(p.jid || p.id || p.lid))
  const me = md.participants.find((p) => isBot(sock, p.jid || p.id || p.lid))
  const v = { at: Date.now(), admins: new Set(list), botAdmin: !!me?.admin, size: md.participants.length, subject: md.subject }
  cache.set(from, v)
  return v
}
const isAdminOf = async (sock, from, jid) => (await admins(sock, from)).admins.has(userOf(jid))
const del = (sock, from, msg) => sock.sendMessage(from, { delete: msg.key }).catch(() => {})

module.exports = { st, G, admins, isAdminOf, del }
