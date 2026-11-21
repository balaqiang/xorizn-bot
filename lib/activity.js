const { createStore } = require('./store')
const { userOf } = require('./utils')

const store = createStore('activity', { groups: {} })

function count(groupJid, sender) {
  const g = (store.data.groups[groupJid] ||= {})
  const k = userOf(sender)
  g[k] = (g[k] || 0) + 1
  store.save()
}

const top = (groupJid, n = 10) =>
  Object.entries(store.data.groups[groupJid] || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)

const total = (groupJid) => Object.values(store.data.groups[groupJid] || {}).reduce((a, b) => a + b, 0)
const reset = (groupJid) => {
  delete store.data.groups[groupJid]
  store.save()
}

module.exports = { count, top, total, reset }
