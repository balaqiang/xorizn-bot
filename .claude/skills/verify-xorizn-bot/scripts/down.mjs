// Stop and delete a verification instance. Never touches the evidence folder.
//   node .claude/skills/verify-xorizn-bot/scripts/down.mjs --name v1      (or --all)
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { INSTANCES, parseArgs, instanceDir, instanceFile, evidenceDir, pidAlive, portOwner, http, sleep } from './lib.mjs'

const args = parseArgs(['all'])
const names = args.all ? (fs.existsSync(INSTANCES) ? fs.readdirSync(INSTANCES) : []) : [String(args.name || 'v1')]

for (const name of names) {
  const dir = instanceDir(name)
  if (!fs.existsSync(dir)) {
    console.log(`${name}: nothing to clean`)
    continue
  }
  let inst = null
  try {
    inst = JSON.parse(fs.readFileSync(instanceFile(name), 'utf8'))
  } catch {}
  if (inst?.pid && pidAlive(inst.pid)) {
    // graceful first: lifecycle.js saves the database, then exits
    try {
      await http('POST', `${inst.controlUrl}/shutdown`, { timeoutMs: 3000 })
    } catch {}
    for (let i = 0; i < 40 && pidAlive(inst.pid); i++) await sleep(250)
    if (pidAlive(inst.pid)) {
      // kill only the process tree we started (its pid is in instance.json), never by name
      if (process.platform === 'win32') {
        try {
          execFileSync('taskkill', ['/PID', String(inst.pid), '/T', '/F'], { stdio: 'ignore' })
        } catch {}
      } else {
        try {
          process.kill(-inst.pid, 'SIGKILL')
        } catch {}
      }
    }
  }
  if (inst?.port && portOwner(inst.port)) console.warn(`${name}: port ${inst.port} still has a listener (pid ${portOwner(inst.port)}); not ours to kill, check it.`)
  // keep the boot log with the evidence before deleting the instance
  if (inst?.logFile && fs.existsSync(inst.logFile)) fs.copyFileSync(inst.logFile, path.join(evidenceDir(name), 'run.log'))
  for (let i = 0; i < 10; i++) {
    try {
      fs.rmSync(dir, { recursive: true, force: true }) // the node_modules junction is removed, not followed
      break
    } catch {
      await sleep(500) // Windows may hold file handles for a moment after exit
    }
  }
  console.log(`${name}: ${fs.existsSync(dir) ? `FAILED to remove ${dir}` : 'stopped and removed'}; evidence kept in ${inst?.evidence || evidenceDir(name)}`)
}
