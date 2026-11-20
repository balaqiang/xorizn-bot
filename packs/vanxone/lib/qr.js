// lib/qr.js — pembuat QR Code (mode byte, koreksi error level M, versi 1-40) tanpa dependensi
'use strict'

const ECC_PER_BLOCK = [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28]
const NUM_BLOCKS = [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49]

const rawModules = (v) => {
  let r = (16 * v + 128) * v + 64
  if (v >= 2) {
    const n = Math.floor(v / 7) + 2
    r -= (25 * n - 10) * n - 55
    if (v >= 7) r -= 36
  }
  return r
}
const dataCodewords = (v) => Math.floor(rawModules(v) / 8) - ECC_PER_BLOCK[v] * NUM_BLOCKS[v]

// ---- Reed-Solomon GF(256) ----
function rsDivisor(deg) {
  const res = new Array(deg).fill(0)
  res[deg - 1] = 1
  let root = 1
  for (let i = 0; i < deg; i++) {
    for (let j = 0; j < deg; j++) {
      res[j] = gmul(res[j], root)
      if (j + 1 < deg) res[j] ^= res[j + 1]
    }
    root = gmul(root, 2)
  }
  return res
}
function gmul(x, y) {
  let z = 0
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d)
    z ^= ((y >>> i) & 1) * x
  }
  return z
}
function rsRemainder(data, div) {
  const res = div.map(() => 0)
  for (const b of data) {
    const f = b ^ res.shift()
    res.push(0)
    div.forEach((c, i) => (res[i] ^= gmul(c, f)))
  }
  return res
}

function interleave(data, v) {
  const nb = NUM_BLOCKS[v]
  const eccLen = ECC_PER_BLOCK[v]
  const raw = Math.floor(rawModules(v) / 8)
  const nShort = nb - (raw % nb)
  const shortLen = Math.floor(raw / nb)
  const blocks = []
  const div = rsDivisor(eccLen)
  for (let i = 0, k = 0; i < nb; i++) {
    const dat = data.slice(k, k + shortLen - eccLen + (i < nShort ? 0 : 1))
    k += dat.length
    const ecc = rsRemainder(dat, div)
    if (i < nShort) dat.push(0)
    blocks.push(dat.concat(ecc))
  }
  const out = []
  for (let i = 0; i < blocks[0].length; i++) {
    blocks.forEach((b, j) => {
      if (i !== shortLen - eccLen || j >= nShort) out.push(b[i])
    })
  }
  return out
}

function bytesOf(text) {
  return [...Buffer.from(String(text), 'utf8')]
}

function encode(text) {
  const bytes = bytesOf(text)
  let v = 1
  for (; v <= 40; v++) {
    const cap = dataCodewords(v) * 8
    if (4 + (v < 10 ? 8 : 16) + bytes.length * 8 <= cap) break
  }
  if (v > 40) throw Object.assign(new Error('qr-too-long'), { userMessage: 'Teks terlalu panjang untuk QR (maks sekitar 2.300 karakter).' })
  const bits = []
  const put = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1) }
  put(4, 4)
  put(bytes.length, v < 10 ? 8 : 16)
  bytes.forEach((b) => put(b, 8))
  const cap = dataCodewords(v) * 8
  put(0, Math.min(4, cap - bits.length))
  put(0, (8 - (bits.length % 8)) % 8)
  for (let pad = 0xec; bits.length < cap; pad ^= 0xec ^ 0x11) put(pad, 8)
  const data = []
  for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(''), 2))
  const all = interleave(data, v)

  const size = v * 4 + 17
  const mod = Array.from({ length: size }, () => new Array(size).fill(false))
  const fn = Array.from({ length: size }, () => new Array(size).fill(false))
  const setF = (x, y, d) => { mod[y][x] = d; fn[y][x] = true }
  for (let i = 0; i < size; i++) { setF(6, i, i % 2 === 0); setF(i, 6, i % 2 === 0) }
  const finder = (cx, cy) => {
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const d = Math.max(Math.abs(dx), Math.abs(dy))
      const x = cx + dx
      const y = cy + dy
      if (x >= 0 && x < size && y >= 0 && y < size) setF(x, y, d !== 2 && d !== 4)
    }
  }
  finder(3, 3); finder(size - 4, 3); finder(3, size - 4)
  const align = []
  if (v > 1) {
    const n = Math.floor(v / 7) + 2
    const step = v === 32 ? 26 : Math.ceil((v * 4 + 4) / (n * 2 - 2)) * 2
    align.push(6)
    for (let p = size - 7; align.length < n; p -= step) align.splice(1, 0, p)
  }
  align.forEach((ax, i) => align.forEach((ay, j) => {
    if ((i === 0 && j === 0) || (i === 0 && j === align.length - 1) || (i === align.length - 1 && j === 0)) return
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) setF(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1)
  }))
  const bit = (x, i) => ((x >>> i) & 1) !== 0
  const drawFormat = (mask) => {
    const d = (0 << 3) | mask // level M = 00
    let rem = d
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537)
    const b = ((d << 10) | rem) ^ 0x5412
    for (let i = 0; i <= 5; i++) setF(8, i, bit(b, i))
    setF(8, 7, bit(b, 6)); setF(8, 8, bit(b, 7)); setF(7, 8, bit(b, 8))
    for (let i = 9; i < 15; i++) setF(14 - i, 8, bit(b, i))
    for (let i = 0; i < 8; i++) setF(size - 1 - i, 8, bit(b, i))
    for (let i = 8; i < 15; i++) setF(8, size - 15 + i, bit(b, i))
    setF(8, size - 8, true)
  }
  drawFormat(0)
  if (v >= 7) {
    let rem = v
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25)
    const b = (v << 12) | rem
    for (let i = 0; i < 18; i++) {
      const a = size - 11 + (i % 3)
      const c = Math.floor(i / 3)
      setF(a, c, bit(b, i)); setF(c, a, bit(b, i))
    }
  }
  // letakkan data
  let k = 0
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5
    for (let vert = 0; vert < size; vert++) for (let j = 0; j < 2; j++) {
      const x = right - j
      const y = ((right + 1) & 2) === 0 ? size - 1 - vert : vert
      if (!fn[y][x] && k < all.length * 8) { mod[y][x] = bit(all[k >>> 3], 7 - (k & 7)); k++ }
    }
  }
  const MASKS = [(x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, (x) => x % 3 === 0, (x, y) => (x + y) % 3 === 0, (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0, (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0, (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0]
  const applyMask = (m) => { for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!fn[y][x] && MASKS[m](x, y)) mod[y][x] = !mod[y][x] }
  const penalty = () => {
    let p = 0
    const line = (get) => {
      for (let a = 0; a < size; a++) {
        let run = 1
        for (let b = 1; b < size; b++) {
          if (get(a, b) === get(a, b - 1)) { run++; if (run === 5) p += 3; else if (run > 5) p++ } else run = 1
        }
        const s = Array.from({ length: size }, (_, b) => (get(a, b) ? 1 : 0)).join('')
        const m1 = s.match(/10111010000|00001011101/g)
        if (m1) p += m1.length * 40
      }
    }
    line((y, x) => mod[y][x]); line((x, y) => mod[y][x])
    for (let y = 0; y < size - 1; y++) for (let x = 0; x < size - 1; x++) if (mod[y][x] === mod[y][x + 1] && mod[y][x] === mod[y + 1][x] && mod[y][x] === mod[y + 1][x + 1]) p += 3
    const dark = mod.flat().filter(Boolean).length
    p += Math.floor(Math.abs((dark * 20) - size * size * 10) / (size * size)) * 10
    return p
  }
  let best = 0
  let bestP = Infinity
  for (let m = 0; m < 8; m++) {
    applyMask(m); drawFormat(m)
    const p = penalty()
    if (p < bestP) { best = m; bestP = p }
    applyMask(m)
  }
  applyMask(best); drawFormat(best)
  return { size, version: v, modules: mod, isFunction: fn }
}

module.exports = { encode }
