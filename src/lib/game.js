// Helper ekonomi & permainan
const { getUser, save } = require('./db')

const fmt = (n) => Math.floor(n).toLocaleString('id-ID')
const rp = (n) => `Rp${fmt(n)}`
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

function duration(ms) {
  const s = Math.ceil(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const d = s % 60
  return [h && `${h} jam`, m && `${m} menit`, (d || (!h && !m)) && `${d} detik`].filter(Boolean).join(' ')
}

// "5000", "50.000", "5k", "2jt", "all" -> angka (null kalau tidak valid)
function parseAmount(raw, all) {
  const s = String(raw || '').toLowerCase().replace(/[.,_\s]/g, '')
  if (s === 'all' || s === 'semua') return all
  const m = s.match(/^(\d+)(k|rb|jt)?$/)
  if (!m) return null
  const n = Number(m[1]) * ({ k: 1e3, rb: 1e3, jt: 1e6 }[m[2]] || 1)
  return Number.isSafeInteger(n) ? n : null
}

// sisa waktu cooldown (ms), 0 kalau sudah boleh
function cooldown(user, key, ms) {
  const left = (user[key] || 0) + ms - Date.now()
  return left > 0 ? left : 0
}

module.exports = { getUser, save, fmt, rp, rand, pick, duration, parseAmount, cooldown }
