// Deteksi flood: pesan beruntun dari satu orang dalam waktu singkat
const { createStore } = require('./store')
const { userOf } = require('./utils')

const store = createStore('antispam', { groups: {} })
const WINDOW = 8000 // ms
const LIMIT = 6 // pesan dalam WINDOW
const WARN_COOLDOWN = 60000

const track = new Map() // `${group}:${user}` -> [{ t, key }]
const lastWarn = new Map()

const enabled = (g) => !!store.data.groups[g]
function setEnabled(g, on) {
  if (on) store.data.groups[g] = true
  else delete store.data.groups[g]
  store.save()
}

// Catat satu pesan. Hasil: null, atau { keys: [...pesan yang perlu dihapus], warn: boolean }
function check(group, sender, key, now = Date.now()) {
  const id = `${group}:${userOf(sender)}`
  const arr = (track.get(id) || []).filter((x) => now - x.t < WINDOW)
  arr.push({ t: now, key })
  if (arr.length < LIMIT) {
    track.set(id, arr)
    if (track.size > 5000) track.delete(track.keys().next().value)
    return null
  }
  track.delete(id)
  const warn = now - (lastWarn.get(id) || 0) > WARN_COOLDOWN
  if (warn) lastWarn.set(id, now)
  return { keys: arr.map((x) => x.key), warn }
}

module.exports = { enabled, setEnabled, check, WINDOW, LIMIT }
