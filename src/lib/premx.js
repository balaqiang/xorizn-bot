// lib/premx.js — premium sementara (berbatas hari), trial & bonus harian. Memakai lib/ztowner untuk status premium.
'use strict'
const st = require('./jstore').open('premx', { exp: {}, trial: [], daily: {} })
const zp = require('./engine/pulse-owner')
const { userOf } = require('./utils')

const DAY = 86400000
const id = (j) => userOf(String(j).includes('@') ? j : `${String(j).replace(/\D/g, '')}@s.whatsapp.net`)

function left(jid) { const e = st.data.exp[id(jid)]; return e ? e - Date.now() : null }

function give(jid, days) {
  const u = id(jid)
  const base = Math.max(Date.now(), st.data.exp[u] || 0)
  st.data.exp[u] = base + days * DAY
  zp.addPrem(u)
  st.save()
  return st.data.exp[u]
}
function take(jid, days) {
  const u = id(jid)
  if (!st.data.exp[u]) return null
  st.data.exp[u] -= days * DAY
  if (st.data.exp[u] <= Date.now()) { delete st.data.exp[u]; zp.delPrem(u) }
  st.save()
  return st.data.exp[u] || 0
}
function clear(jid) { const u = id(jid); const had = !!st.data.exp[u]; delete st.data.exp[u]; st.save(); return had }

function sweep() {
  const gone = []
  const now = Date.now()
  for (const [u, t] of Object.entries(st.data.exp)) {
    if (t <= now) { delete st.data.exp[u]; zp.delPrem(u); gone.push(u) }
  }
  if (gone.length) st.save()
  return gone
}

function fmt(ms) {
  if (ms <= 0) return 'habis'
  const d = Math.floor(ms / DAY), h = Math.floor((ms % DAY) / 3600000), m = Math.floor((ms % 3600000) / 60000)
  return [d && `${d} hari`, h && `${h} jam`, !d && `${m} menit`].filter(Boolean).join(' ') || '<1 menit'
}
const trialUsed = (jid) => st.data.trial.includes(id(jid))
function markTrial(jid) { st.data.trial.push(id(jid)); st.save() }

module.exports = { st, id, DAY, left, give, take, clear, sweep, fmt, trialUsed, markTrial }
