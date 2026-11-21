// Banyak plugin vanXone baca/tulis langsung ke global.db.data.users/chats/settings (gaya ygg-base).
// vanXone sendiri punya sistem database sendiri (lib/ourin-database dkk), jadi di sini dibikinkan
// "global.db" versi ringan yang kompatibel, disimpan terpisah supaya tidak bentrok dengan data asli vanXone.
'use strict'
const fs = require('fs')
const path = require('path')
const FILE = path.join(__dirname, '..', '..', 'database', 'kilua2', 'db.json')

function load() {
  try { return JSON.parse(fs.readFileSync(FILE, 'utf8')) } catch { return { users: {}, chats: {}, settings: {}, cap: {} } }
}
function ensure() {
  if (!global.db || !global.db.__isKiluaShim) {
    const data = load()
    global.db = {
      __isKiluaShim: true,
      data,
      async read() {},
      async write() {
        try { fs.mkdirSync(path.dirname(FILE), { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(data)) } catch {}
      }
    }
    setInterval(() => global.db.write().catch(() => {}), 30000).unref?.()
  }
  return global.db
}
function ensureUser(jid) {
  const db = ensure()
  if (!db.data.users[jid]) {
    db.data.users[jid] = { exp: 0, limit: 999999, money: 0, level: 0, warn: 0, banned: false, premium: false, registered: true, name: '', afk: -1, afkReason: '' }
  }
  return db.data.users[jid]
}
function ensureChat(jid) {
  const db = ensure()
  if (!db.data.chats[jid]) db.data.chats[jid] = { isBanned: false, welcome: true, sWelcome: '', sBye: '' }
  return db.data.chats[jid]
}
module.exports = { ensure, ensureUser, ensureChat }
