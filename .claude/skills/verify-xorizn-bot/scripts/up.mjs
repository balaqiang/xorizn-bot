// Start an isolated verification instance of xorizn-bot.
//   node .claude/skills/verify-xorizn-bot/scripts/up.mjs [--name v1] [--packs default|core|classic,extra] [--copy-keys] [--timeout 180]
// Copies the current working tree (tracked + untracked, minus .gitignore'd files) into
// %TEMP%/xorizn-verify/<name>/app, links node_modules, writes a fresh config.json, and boots
// `node --import preload.mjs src/index.js --no-connect`. Prints the instance JSON when it is usable.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawn } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { REPO, SKILL_DIR, FIXTURE, parseArgs, instanceDir, instanceFile, evidenceDir, freePort, pidAlive, git, treeFingerprint, http, sleep } from './lib.mjs'

const args = parseArgs(['copy-keys'])
const name = String(args.name || 'v1')
const timeoutMs = Number(args.timeout || 180) * 1000
const dir = instanceDir(name)

if (fs.existsSync(instanceFile(name))) {
  const old = JSON.parse(fs.readFileSync(instanceFile(name), 'utf8'))
  if (pidAlive(old.pid)) {
    console.error(`instance "${name}" is already running (pid ${old.pid}). Use it, or run down.mjs --name ${name} first.`)
    process.exit(1)
  }
}
fs.rmSync(dir, { recursive: true, force: true })
const app = path.join(dir, 'app')
fs.mkdirSync(app, { recursive: true })

// 1. copy the working tree
const t0 = Date.now()
const files = git(['ls-files', '-co', '--exclude-standard', '-z']).split('\0').filter(Boolean).filter((f) => !f.startsWith('.claude/') && !f.startsWith('.verify/'))
for (const f of files) {
  const src = path.join(REPO, f)
  if (!fs.existsSync(src)) continue // deleted in the working tree but still in the index
  const dst = path.join(app, f)
  fs.mkdirSync(path.dirname(dst), { recursive: true })
  fs.cpSync(src, dst, { dereference: false })
}
fs.symlinkSync(path.join(REPO, 'node_modules'), path.join(app, 'node_modules'), 'junction')
const fingerprint = treeFingerprint()

// 2. config: example + isolation overrides (never the user's config.json, except opt-in keys/packs)
const example = JSON.parse(fs.readFileSync(path.join(app, 'config', 'config.example.json'), 'utf8'))
let userCfg = {}
if (args.packs === undefined || args['copy-keys']) {
  try {
    userCfg = JSON.parse(fs.readFileSync(path.join(REPO, 'config', 'config.json'), 'utf8'))
  } catch {}
}
const port = await freePort()
const controlPort = await freePort()
const password = crypto.randomBytes(12).toString('base64url')
let packs = { ...example.packs, ...(userCfg.packs || {}) }
if (args.packs === 'default') packs = example.packs
else if (args.packs !== undefined) {
  const selected = String(args.packs).split(',')
  packs = { classic: selected.includes('classic'), extra: selected.includes('extra') }
}
const config = {
  ...example,
  bot: { ...example.bot, name: 'xorizn-verify', owners: [FIXTURE.owner], pairingNumber: '' },
  database: { ...example.database, driver: 'json' },
  dashboard: { enabled: true, host: '127.0.0.1', port, password },
  packs,
  ...(args['copy-keys'] ? { apiKeys: userCfg.apiKeys || example.apiKeys, integrations: userCfg.integrations || example.integrations } : {})
}
fs.writeFileSync(path.join(app, 'config', 'config.json'), JSON.stringify(config, null, 2))

// 3. boot
const evidence = evidenceDir(name)
const logFile = path.join(dir, 'run.log')
const out = fs.openSync(logFile, 'a')
const preload = pathToFileURL(path.join(SKILL_DIR, 'scripts', 'preload.mjs')).href
const child = spawn(process.execPath, ['--import', preload, path.join(app, 'src', 'index.js'), '--no-connect'], {
  cwd: app,
  detached: true,
  windowsHide: true,
  stdio: ['ignore', out, out],
  env: { ...process.env, VERIFY_APP_DIR: app, VERIFY_CONTROL_PORT: String(controlPort), VERIFY_EVIDENCE_DIR: evidence, FORCE_COLOR: '0', DB_DRIVER: 'json' }
})
child.unref()
fs.closeSync(out)

const inst = {
  name,
  pid: child.pid,
  dir,
  app,
  logFile,
  evidence,
  dashboardUrl: `http://127.0.0.1:${port}`,
  controlUrl: `http://127.0.0.1:${controlPort}`,
  port,
  controlPort,
  password,
  packs,
  fixture: FIXTURE,
  fingerprint,
  startedAt: new Date().toISOString(),
  copyMs: Date.now() - t0
}
fs.writeFileSync(instanceFile(name), JSON.stringify(inst, null, 2))

// 4. ready = control /health says booted AND the dashboard answers /api/session
const deadline = Date.now() + timeoutMs
let health = null
let usable = false
while (Date.now() < deadline && !usable) {
  if (!pidAlive(child.pid)) break
  try {
    health = (await http('GET', `${inst.controlUrl}/health`, { timeoutMs: 3000 })).json
    if (health?.bootError) break
    if (health?.ready) usable = (await http('GET', `${inst.dashboardUrl}/api/session`, { timeoutMs: 3000 })).status === 200
  } catch {}
  if (!usable) await sleep(500)
}
if (usable) {
  console.log(JSON.stringify({ ...inst, password: undefined, health, bootMs: Date.now() - t0 }, null, 2))
} else {
  const tail = fs.readFileSync(logFile, 'utf8').split('\n').slice(-40).join('\n')
  console.error(`instance "${name}" did not become ready (alive=${pidAlive(child.pid)}, health=${JSON.stringify(health)}).\n--- ${logFile} (tail) ---\n${tail}`)
  console.error(`Clean up with: node ${path.relative(REPO, path.join(SKILL_DIR, 'scripts', 'down.mjs'))} --name ${name}`)
  process.exitCode = 1
}
// no process.exit(): on Windows exiting while the detached child's handles close can abort Node (exit 127)
