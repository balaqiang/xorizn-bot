// lib/jstore.js — penyimpanan JSON sederhana per modul: const st = require('./jstore').open('rpg', { users: {} }); st.data.users.x = 1; st.save()
'use strict'
const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '..', 'database')
const cache = new Map()

function open(name, defaults = {}) {
  if (cache.has(name)) return cache.get(name)
  const file = path.join(dir, `${name}.json`)
  // [core] simpan di database pilihan (JSON/SQLite/MySQL) bila dijalankan lewat core bot
  if (global.__coreStore) {
    const s = global.__coreStore.open(`classic:${name}`, defaults, file)
    const st = { get data() { return s.data }, save: s.save, flush: s.flush }
    cache.set(name, st)
    return st
  }
  let data = JSON.parse(JSON.stringify(defaults))
  try { Object.assign(data, JSON.parse(fs.readFileSync(file, 'utf8'))) } catch {}
  let timer = null
  const flush = () => {
    clearTimeout(timer)
    try {
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(file + '.tmp', JSON.stringify(data))
      fs.renameSync(file + '.tmp', file)
    } catch (err) { console.log(`[JSTORE:${name}] gagal menyimpan:`, err.message) }
  }
  const st = {
    get data() { return data },
    save() { clearTimeout(timer); timer = setTimeout(flush, 1500); if (timer.unref) timer.unref() },
    flush
  }
  cache.set(name, st)
  return st
}

module.exports = { open }
