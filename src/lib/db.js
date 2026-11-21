const fs = require('fs')
const path = require('path')
const { userOf } = require('./utils')

const dir = path.join(__dirname, '..', 'database')
const file = path.join(dir, 'users.json')

let users = {}
// [core] simpan di database pilihan (JSON/SQLite/MySQL) bila dijalankan lewat core bot
const coreStore = global.__coreStore ? global.__coreStore.open('classic:users', {}, file) : null
if (coreStore) users = coreStore.data
else try {
  users = JSON.parse(fs.readFileSync(file, 'utf8'))
} catch {}

let timer = null
function save() {
  if (coreStore) return coreStore.save()
  clearTimeout(timer)
  timer = setTimeout(() => {
    try {
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(file, JSON.stringify(users, null, 2))
    } catch (err) {
      console.log('[DB] gagal menyimpan:', err.message)
    }
  }, 2000)
}

// EXP yang dibutuhkan untuk naik dari level ini
const expNeeded = (level) => 100000 * (level + 1)

function getUser(jid) {
  const id = userOf(jid)
  if (!users[id]) {
    users[id] = { name: '', exp: 0, level: 0, money: 100000, bank: 0, limit: 50 }
    save()
  }
  return users[id]
}

function addExp(jid, amount) {
  const u = getUser(jid)
  u.exp += amount
  while (u.exp >= expNeeded(u.level)) {
    u.exp -= expNeeded(u.level)
    u.level++
  }
  save()
  return u
}

const countUsers = () => Object.keys(users).length

// Papan peringkat: by = 'money' (money + bank) atau 'level'
function topUsers(by = 'money', n = 10) {
  const list = Object.entries(users).map(([id, u]) => ({ id, ...u }))
  const score = (u) => (by === 'level' ? u.level * 1e12 + u.exp : u.money + u.bank)
  return list.sort((a, b) => score(b) - score(a)).slice(0, n)
}

const all = () => users

module.exports = { getUser, addExp, expNeeded, countUsers, topUsers, save, all }
