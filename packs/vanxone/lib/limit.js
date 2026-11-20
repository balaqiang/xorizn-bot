// lib/limit.js — pemakaian limit untuk fitur berat (owner bebas limit)
'use strict'

const { getUser, save } = require('./db')

// -> null kalau cukup, atau pesan penolakan
function lack(sender, cost, isOwner) {
  if (isOwner || !cost || require('./engine/pulse-owner').isPremium(sender)) return null
  const u = getUser(sender)
  return u.limit >= cost ? null : `Limit kamu tidak cukup (butuh ${cost}, sisa ${u.limit}). Beli limit dengan ${global.prefix || '.'}buylimit.`
}

function spend(sender, cost, isOwner) {
  if (isOwner || !cost || require('./engine/pulse-owner').isPremium(sender)) return
  const u = getUser(sender)
  u.limit = Math.max(0, u.limit - cost)
  save()
}

module.exports = { lack, spend }
