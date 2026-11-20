// lib/gamesession.js — sesi game per (chat + pemain) dengan kedaluwarsa otomatis, plus hadiah uang
'use strict'

const { getUser, save } = require('./db')
const { userOf } = require('./utils')

function sessions(ttlMs = 30 * 60 * 1000, max = 500) {
  const map = new Map()
  const key = (from, sender) => `${from}|${userOf(sender)}`
  const sweep = () => {
    const now = Date.now()
    for (const [k, v] of map) if (now - v.at > ttlMs) map.delete(k)
  }
  return {
    get(from, sender) {
      sweep()
      const v = map.get(key(from, sender))
      if (v) v.at = Date.now()
      return v ? v.state : null
    },
    set(from, sender, state) {
      sweep()
      if (map.size >= max) map.delete(map.keys().next().value)
      map.set(key(from, sender), { state, at: Date.now() })
      return state
    },
    del(from, sender) {
      map.delete(key(from, sender))
    }
  }
}

// beri hadiah uang (owner juga dapat); -> saldo baru
function reward(sender, amount) {
  amount = Math.max(0, Math.floor(amount))
  if (!amount) return null
  const u = getUser(sender)
  u.money += amount
  save()
  return u.money
}
const rp = (n) => `Rp${Math.round(n).toLocaleString('id-ID')}`

module.exports = { sessions, reward, rp }
