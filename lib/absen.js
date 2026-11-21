const { createStore } = require('./store')
const { userOf } = require('./utils')

const store = createStore('absen', { groups: {} })

const get = (g) => store.data.groups[g] || null
function start(g, title, by) {
  store.data.groups[g] = { title, by, at: Date.now(), list: [] }
  store.save()
  return store.data.groups[g]
}
function mark(g, jid, name) {
  const a = get(g)
  if (!a) return { error: 'none' }
  const id = userOf(jid)
  if (a.list.some((x) => x.id === id)) return { error: 'dup' }
  a.list.push({ id, jid, name: name || id, at: Date.now() })
  store.save()
  return { count: a.list.length }
}
function end(g) {
  const a = get(g)
  delete store.data.groups[g]
  store.save()
  return a
}

module.exports = { get, start, mark, end }
