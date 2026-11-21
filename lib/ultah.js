const { createStore } = require('./store')
const { userOf } = require('./utils')

const store = createStore('ultah', { users: {} }) // nomor -> { d, m, y? }

const set = (jid, d, m, y) => { store.data.users[userOf(jid)] = { d, m, ...(y ? { y } : {}) }; store.save() }
const remove = (jid) => { const had = delete store.data.users[userOf(jid)]; store.save(); return had }

// hari sampai ulang tahun berikutnya (0 = hari ini)
function daysUntil(d, m, now = new Date()) {
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  let t = Date.UTC(now.getFullYear(), m - 1, d)
  if (t < today) t = Date.UTC(now.getFullYear() + 1, m - 1, d)
  return Math.round((t - today) / 86400000)
}

function upcoming(numbers, limit = 10, now = new Date()) {
  return numbers
    .filter((n) => store.data.users[n])
    .map((n) => ({ n, ...store.data.users[n], left: daysUntil(store.data.users[n].d, store.data.users[n].m, now) }))
    .sort((a, b) => a.left - b.left)
    .slice(0, limit)
}

module.exports = { set, remove, upcoming, daysUntil, store }
