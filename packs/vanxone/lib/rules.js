const { createStore } = require('./store')

const store = createStore('rules', { groups: {} })

const get = (jid) => store.data.groups[jid] || null
function set(jid, text) {
  store.data.groups[jid] = { text, time: Date.now() }
  store.save()
}
function clear(jid) {
  const had = !!store.data.groups[jid]
  delete store.data.groups[jid]
  store.save()
  return had
}

module.exports = { get, set, clear }
