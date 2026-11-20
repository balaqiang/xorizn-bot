// lib/grouptools.js — catatan grup, auto-respon, dan antidelete (dipanggil dari bot.js untuk setiap pesan)
'use strict'

const { createStore } = require('./store')
const { userOf } = require('./utils')

const store = createStore('grouptools', { notes: {}, resp: {}, antidelete: {} })
const D = store.data
D.notes = D.notes || {}
D.resp = D.resp || {}
D.antidelete = D.antidelete || {}

const norm = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ')

// ---------- catatan ----------
const notes = {
  list: (g) => Object.keys(D.notes[g] || {}),
  get: (g, k) => (D.notes[g] || {})[norm(k)] || null,
  set(g, k, v) {
    D.notes[g] = D.notes[g] || {}
    if (!D.notes[g][norm(k)] && Object.keys(D.notes[g]).length >= 100) throw new Error('Maksimal 100 catatan per grup.')
    D.notes[g][norm(k)] = { text: v, at: Date.now() }
    store.save()
  },
  del(g, k) {
    if (!D.notes[g] || !D.notes[g][norm(k)]) return false
    delete D.notes[g][norm(k)]
    store.save()
    return true
  }
}

// ---------- auto-respon ----------
const resp = {
  list: (g) => Object.entries(D.resp[g] || {}),
  set(g, k, v, contains) {
    D.resp[g] = D.resp[g] || {}
    if (!D.resp[g][norm(k)] && Object.keys(D.resp[g]).length >= 50) throw new Error('Maksimal 50 auto-respon per grup.')
    D.resp[g][norm(k)] = { text: v, contains: !!contains }
    store.save()
  },
  del(g, k) {
    if (!D.resp[g] || !D.resp[g][norm(k)]) return false
    delete D.resp[g][norm(k)]
    store.save()
    return true
  }
}
const cooldown = new Map()

// ---------- antidelete ----------
const cache = new Map() // id -> { msg, at }
const MAX_CACHE = 400
const antidelete = {
  isOn: (g) => !!D.antidelete[g],
  set(g, on) {
    if (on) D.antidelete[g] = true
    else delete D.antidelete[g]
    store.save()
  }
}

// Return true bila pesan sudah ditangani penuh (tidak perlu diproses lagi)
async function observe(sock, msg, { from, sender, isGroup, body, prefix }) {
  if (!isGroup || !msg.message) return false
  const { normalizeMessageContent } = require('@whiskeysockets/baileys')
  const m = normalizeMessageContent(msg.message)

  if (D.antidelete[from]) {
    const pm = m?.protocolMessage
    if (pm && (pm.type === 0 || pm.type === 'REVOKE') && pm.key?.id) {
      const hit = cache.get(pm.key.id)
      if (hit && !hit.msg.key.fromMe) {
        cache.delete(pm.key.id)
        const who = hit.msg.key.participant || hit.msg.participant || sender
        await sock.sendMessage(from, { text: `🗑️ *ANTIDELETE*\n@${userOf(who)} menghapus pesan ini:`, mentions: [who] }).catch(() => {})
        await sock.sendMessage(from, { forward: hit.msg }).catch((e) => console.log('[ANTIDELETE] gagal meneruskan:', e.message))
      }
      return true
    }
    if (m && !m.protocolMessage && msg.key.id && !msg.key.fromMe) {
      cache.set(msg.key.id, { msg, at: Date.now() })
      if (cache.size > MAX_CACHE) cache.delete(cache.keys().next().value)
    }
  }

  const rs = D.resp[from]
  if (rs && body && !msg.key.fromMe && !body.startsWith(prefix)) {
    const t = norm(body)
    for (const [k, v] of Object.entries(rs)) {
      if (v.contains ? t.includes(k) : t === k) {
        const ck = `${from}|${k}`
        if (Date.now() - (cooldown.get(ck) || 0) < 5000) return false
        cooldown.set(ck, Date.now())
        const name = msg.pushName || userOf(sender)
        await sock.sendMessage(from, { text: v.text.replace(/\{nama\}/gi, name) }, { quoted: msg })
        return false
      }
    }
  }
  return false
}

module.exports = { notes, resp, antidelete, observe, norm }
