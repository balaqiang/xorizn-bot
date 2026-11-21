// lib/fx.js — helper kecil untuk fitur-fitur baru (acak, seed harian, target, format)
const { getTargets, userOf } = require('./utils')

const pick = (a) => a[Math.floor(Math.random() * a.length)]
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a
const shuffle = (a) => {
  const x = [...a]
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[x[i], x[j]] = [x[j], x[i]]
  }
  return x
}
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date())

// angka acak yang konsisten untuk (seed) — dipakai fitur "cek" supaya hasil hari ini tidak berubah-ubah
function seeded(seed) {
  let h = 2166136261
  for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}
const dayRand = (key, min = 0, max = 100) => Math.floor(seeded(`${key}|${today()}`)() * (max - min + 1)) + min

const bar = (pct, n = 10) => {
  const f = Math.max(0, Math.min(n, Math.round((pct / 100) * n)))
  return '▰'.repeat(f) + '▱'.repeat(n - f)
}
const fmt = (n) => Math.floor(Number(n) || 0).toLocaleString('id-ID')
const rp = (n) => `Rp${fmt(n)}`
const num = (n, d = 2) => Number(n).toLocaleString('id-ID', { maximumFractionDigits: d })

// target: mention / reply / nomor, kalau tidak ada = pengirim
const targetOf = (msg, args, sender) => getTargets(msg, args)[0] || sender

module.exports = { pick, rand, shuffle, today, seeded, dayRand, bar, fmt, rp, num, targetOf, userOf }
