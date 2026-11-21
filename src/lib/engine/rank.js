// lib/engine/rank.js — menandai plugin hasil adapter engine dengan peringkat muat (angka kecil = menang kalau nama perintah bentrok).
// Plugin asli xorizn-bot tidak punya penanda ini sehingga selalu dimuat lebih dulu dan tidak pernah tertimpa.
'use strict'
module.exports = (rank, fn) => (...args) => {
  const p = fn(...args)
  if (p && typeof p === 'object') Object.defineProperty(p, '__ported', { value: rank, enumerable: false, configurable: true, writable: true })
  return p
}
