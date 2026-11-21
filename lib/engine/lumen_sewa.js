// lib/anya_sewa.js — sistem sewa bot per grup + mode tidur bot
'use strict'
const { open } = require('../jstore')
const st = open('sewa', { groups: {}, mode: false, sleep: { on: false, from: '22:00', to: '06:00' } })
const left = (g) => g.until - Date.now()
const days = (ms) => Math.max(0, Math.ceil(ms / 86400000))
const active = (jid) => { const g = st.data.groups[jid]; return !!g && left(g) > 0 }
function add(jid, d, name = '') {
  const g = (st.data.groups[jid] ||= { until: Date.now(), name, warned: false })
  if (g.until < Date.now()) g.until = Date.now()
  g.until += d * 86400000; g.warned = false; if (name) g.name = name; st.save()
  return g
}
function sleeping() {
  const s = st.data.sleep; if (!s.on) return false
  const now = new Date(Date.now() + 7 * 3600000); const m = now.getUTCHours() * 60 + now.getUTCMinutes()
  const p = (t) => { const [h, mi] = t.split(':').map(Number); return h * 60 + mi }
  const a = p(s.from); const b = p(s.to)
  return a <= b ? m >= a && m < b : m >= a || m < b
}
module.exports = { st, left, days, active, add, sleeping }
