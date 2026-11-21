// Pengingat (reminder) yang tetap tersimpan walau bot restart
const { createStore } = require('./store')
const { userOf } = require('./utils')

const store = createStore('reminders', { list: [], seq: 0 })
let sock = null
let started = false

const MAX_PER_USER = 20
const MAX_MS = 30 * 24 * 60 * 60 * 1000

// "10m", "2j", "1h30m", "45s", "1d" -> ms (null kalau tidak valid)
function parseDuration(raw) {
  const s = String(raw || '').toLowerCase()
  if (!/^(\d+[dhjms])+$/.test(s)) return null
  const unit = { d: 86400000, h: 3600000, j: 3600000, m: 60000, s: 1000 }
  let total = 0
  for (const [, n, u] of s.matchAll(/(\d+)([dhjms])/g)) total += Number(n) * unit[u]
  return total > 0 ? total : null
}

function add({ jid, user, text, ms }) {
  if (ms > MAX_MS) return { error: 'Maksimal pengingat 30 hari.' }
  if (listOf(user).length >= MAX_PER_USER) return { error: `Maksimal ${MAX_PER_USER} pengingat aktif.` }
  const item = { id: ++store.data.seq, jid, user, text, at: Date.now() + ms }
  store.data.list.push(item)
  store.save()
  return { item }
}

const listOf = (user) =>
  store.data.list.filter((r) => userOf(r.user) === userOf(user)).sort((a, b) => a.at - b.at)

function removeAt(user, index) {
  const target = listOf(user)[index - 1]
  if (!target) return false
  store.data.list = store.data.list.filter((r) => r.id !== target.id)
  store.save()
  return true
}

async function tick() {
  if (!sock) return
  const now = Date.now()
  const due = store.data.list.filter((r) => r.at <= now)
  if (!due.length) return
  store.data.list = store.data.list.filter((r) => r.at > now)
  store.save()

  for (const r of due) {
    try {
      await sock.sendMessage(r.jid, {
        text: `⏰ *PENGINGAT*\n@${userOf(r.user)} ${r.text}`,
        mentions: [r.user]
      })
    } catch (err) {
      console.log('[REMINDER] gagal kirim, dicoba lagi 30 detik:', err.message)
      store.data.list.push({ ...r, at: Date.now() + 30000 })
      store.save()
    }
  }
}

// Dipanggil setiap koneksi terbuka; interval hanya dibuat sekali
function startScheduler(s) {
  sock = s
  try {
    require('./groupguard').start(s) // jadwal buka-tutup grup otomatis (.autogc)
  } catch (e) {
    console.log('[AUTOGC] gagal start:', e.message)
  }
  if (started) return
  started = true
  setInterval(() => tick().catch((e) => console.log('[REMINDER]', e.message)), 10000)
}

module.exports = { startScheduler, parseDuration, add, listOf, removeAt }
