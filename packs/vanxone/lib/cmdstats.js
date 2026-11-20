// lib/cmdstats.js — hitung pemakaian perintah (untuk .topcmd dan .riwayat)
const { createStore } = require('./store')
const { userOf } = require('./utils')
const store = createStore('cmdstats', { total: 0, cmds: {}, users: {} })
function hit(command, sender) {
  const s = store.data
  s.total++
  s.cmds[command] = (s.cmds[command] || 0) + 1
  const u = (s.users[userOf(sender)] ||= { n: 0, cmds: {} })
  u.n++
  u.cmds[command] = (u.cmds[command] || 0) + 1
  store.save()
}
const topCmds = (n = 10) => Object.entries(store.data.cmds).sort((a, b) => b[1] - a[1]).slice(0, n)
const userStat = (sender) => store.data.users[userOf(sender)] || { n: 0, cmds: {} }
const total = () => store.data.total
module.exports = { hit, topCmds, userStat, total }
