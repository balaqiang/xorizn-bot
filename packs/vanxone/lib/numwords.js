// lib/numwords.js — angka -> kata bahasa Indonesia
'use strict'
const S = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas']
function say(n) {
  n = Math.floor(n)
  if (n < 12) return S[n]
  if (n < 20) return `${say(n - 10)} belas`
  if (n < 100) return `${S[Math.floor(n / 10)]} puluh${n % 10 ? ` ${S[n % 10]}` : ''}`
  if (n < 200) return `seratus${n - 100 ? ` ${say(n - 100)}` : ''}`
  if (n < 1000) return `${S[Math.floor(n / 100)]} ratus${n % 100 ? ` ${say(n % 100)}` : ''}`
  if (n < 2000) return `seribu${n - 1000 ? ` ${say(n - 1000)}` : ''}`
  if (n < 1e6) return `${say(Math.floor(n / 1000))} ribu${n % 1000 ? ` ${say(n % 1000)}` : ''}`
  for (const [v, w] of [[1e12, 'triliun'], [1e9, 'miliar'], [1e6, 'juta']]) if (n >= v) return `${say(Math.floor(n / v))} ${w}${n % v ? ` ${say(n % v)}` : ''}`
  return ''
}
const terbilang = (n) => (Math.floor(n) === 0 ? 'nol' : say(Math.abs(Math.floor(n))))
module.exports = { terbilang }
