// Uji driver pilihan melalui API dashboard dan dua restart bot --no-connect.
// node .claude/skills/verify-xorizn-bot/scripts/storage-restart.mjs json
// Ganti json dengan sqlite, atau gunakan mysql/postgres diikuti path JSON berisi
// opsi koneksi server uji (field sama dengan config.example.json). Skrip membuat
// database MySQL atau tabel Postgres unik dan mencetak namanya untuk diperiksa.
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { fork } from 'node:child_process'
import { freePort, http, login, sleep, REPO } from './lib.mjs'

const driver = process.argv[2] || 'json'
assert(['json', 'sqlite', 'mysql', 'postgres'].includes(driver))
if (['mysql', 'postgres'].includes(driver)) assert(process.argv[3], 'Berikan path JSON dengan opsi koneksi server uji.')
const options = process.argv[3] ? JSON.parse(fs.readFileSync(process.argv[3], 'utf8')) : {}
const fixture = 'verify_' + randomUUID().replaceAll('-', '')
if (driver === 'mysql') options.database = fixture
if (driver === 'postgres') options.table = fixture
if (driver === 'json' || driver === 'sqlite') options.file = 'data/' + fixture + '.' + driver
fs.mkdirSync(path.join(REPO, '.verify'), { recursive: true })
const root = fs.mkdtempSync(path.join(REPO, '.verify', 'storage-bot-'))
const port = await freePort()
const password = randomUUID()
const instance = { dashboardUrl: 'http://127.0.0.1:' + port, password }
let child, exited, cookie
const jid = '6289990000001@s.whatsapp.net'

async function boot() {
  child = fork(path.join(root, 'src/index.js'), ['--no-connect'], {
    cwd: root, stdio: ['ignore', 'pipe', 'pipe', 'ipc'], execArgv: [],
    env: { ...process.env, DB_DRIVER: '', DASHBOARD_PORT: String(port), DASHBOARD_HOST: '127.0.0.1', BOT_LAUNCHER: '' }
  })
  exited = new Promise((resolve, reject) => { child.once('exit', resolve); child.once('error', reject) })
  let log = ''
  for (const stream of [child.stdout, child.stderr]) stream.on('data', data => { log = (log + data).slice(-3000) })
  for (let i = 0; i < 100; i++) {
    if (child.exitCode !== null) throw new Error('boot failed: ' + log)
    try {
      if ((await http('GET', instance.dashboardUrl + '/api/session')).status === 200) return
    } catch {}
    await sleep(200)
  }
  throw new Error('bot readiness timeout')
}

async function api(method, route, body) {
  const result = await http(method, instance.dashboardUrl + '/api/' + route, { cookie, body })
  assert.equal(result.status, 200, result.json?.error)
  return result.json
}

try {
  for (const rel of ['package.json', 'config/config.example.json', 'src/index.js', 'src/core', 'src/utils', 'src/compat', 'src/features', 'src/dashboard', 'src/plugins/core']) {
    const dst = path.join(root, rel)
    fs.mkdirSync(path.dirname(dst), { recursive: true })
    fs.cpSync(path.join(REPO, rel), dst, { recursive: true })
  }
  fs.writeFileSync(path.join(root, 'config/config.json'), JSON.stringify({ dashboard: { password, port }, packs: { classic: false, extra: false } }))
  await boot()
  const pid1 = child.pid
  cookie = await login(instance)
  await api('PATCH', 'users/' + jid, { limit: 37, banned: true, banReason: 'fixture' })
  const test = await api('POST', 'database/test', { driver, options })
  assert.equal(test.rows, 0, 'fixture target must start empty')
  const migration = await api('POST', 'database/migrate', { driver, options })
  assert.equal(migration.restartRequired, true)
  await api('POST', 'system/restart')
  assert.equal(await exited, 100)
  await boot()
  const active = (await api('GET', 'config')).database.active
  assert.equal(active, driver)
  const user = (await api('GET', 'users?q=6289990000001')).users[0]
  assert.equal(user.id, jid)
  assert.equal(user.limit, 37)
  assert.equal(user.banned, true)
  assert.equal(user.banReason, 'fixture')
  // Ubah lagi saat driver tujuan sudah aktif untuk menguji penulisan normal.
  await api('PATCH', 'users/' + jid, { limit: 41, banned: false })
  await api('POST', 'system/restart')
  assert.equal(await exited, 100)
  await boot()
  assert.equal((await api('GET', 'config')).database.active, driver)
  const updated = (await api('GET', 'users?q=6289990000001')).users[0]
  assert.equal(updated.limit, 41)
  assert.equal(updated.banned, false)
  console.log(JSON.stringify({ driver, target: fixture, rows: migration.rows, fromPid: pid1, finalPid: child.pid, migratedLimit: user.limit, finalLimit: updated.limit, banned: updated.banned }))
} finally {
  if (child?.exitCode == null && child?.connected) {
    child.send({ cmd: 'shutdown' })
    await exited
  }
  fs.rmSync(root, { recursive: true, force: true })
}
