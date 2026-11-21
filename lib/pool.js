// lib/pool.js — "keranjang" media per pengguna: kumpulkan beberapa gambar/PDF/video/audio, lalu olah sekaligus
'use strict'

const { userOf } = require('./utils')

const MAX_ITEMS = 20
const MAX_BYTES = 80 * 1024 * 1024
const TTL = 60 * 60 * 1000
const pools = new Map()

function sweep() {
  const now = Date.now()
  for (const [k, v] of pools) if (now - v.at > TTL) pools.delete(k)
}
const key = (sender) => userOf(sender)

const pool = {
  list(sender) {
    sweep()
    return pools.get(key(sender))?.items || []
  },
  add(sender, item) {
    sweep()
    const k = key(sender)
    const p = pools.get(k) || { items: [], at: Date.now() }
    if (p.items.length >= MAX_ITEMS) throw Object.assign(new Error('penuh'), { userMessage: `Keranjang penuh (maks ${MAX_ITEMS} file). Olah dulu atau kosongkan dengan .kumpul reset` })
    if (p.items.reduce((s, i) => s + i.buffer.length, 0) + item.buffer.length > MAX_BYTES) throw Object.assign(new Error('besar'), { userMessage: 'Total ukuran keranjang melebihi 80 MB.' })
    p.items.push(item)
    p.at = Date.now()
    pools.set(k, p)
    return p.items.length
  },
  remove(sender, n) {
    const p = pools.get(key(sender))
    if (!p || n < 1 || n > p.items.length) return false
    p.items.splice(n - 1, 1)
    return true
  },
  clear(sender) {
    pools.delete(key(sender))
  }
}

module.exports = { pool, MAX_ITEMS }
