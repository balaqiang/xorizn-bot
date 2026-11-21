// Read-only: is this instance worth driving?
//   node .claude/skills/verify-xorizn-bot/scripts/doctor.mjs --name v1
// Exit 0 = healthy. Exit 1 = a check failed (reason printed). STALE (copy older than the working tree) is a warning.
import { parseArgs, readInstance, pidAlive, portOwner, treeFingerprint, http } from './lib.mjs'

const name = String(parseArgs().name || 'v1')
const checks = []
const add = (ok, what, detail = '') => checks.push({ ok, what, detail })
let inst
try {
  inst = readInstance(name)
} catch (err) {
  console.log(`FAIL instance: ${err.message}`)
  process.exit(1)
}

add(pidAlive(inst.pid), 'process alive', `pid ${inst.pid}`)
const owner = portOwner(inst.port)
add(owner === inst.pid, 'dashboard port owned by our process', `port ${inst.port} → pid ${owner}`)
try {
  const h = (await http('GET', `${inst.controlUrl}/health`, { timeoutMs: 3000 })).json
  add(!!h?.ready && !h?.bootError, 'bot booted, fake socket installed', JSON.stringify(h))
  add(h?.connection === 'open', 'bot.status.connection is open (fake)', h?.connection)
  add(h?.app === inst.app, 'control server belongs to this copy', h?.app)
} catch (err) {
  add(false, 'control server answers', err.message)
}
try {
  const s = await http('GET', `${inst.dashboardUrl}/api/session`, { timeoutMs: 3000 })
  add(s.status === 200, 'dashboard /api/session', `${s.status} ${s.text.slice(0, 80)}`)
} catch (err) {
  add(false, 'dashboard answers', err.message)
}
const now = treeFingerprint()
const stale = now.digest !== inst.fingerprint.digest

for (const c of checks) console.log(`${c.ok ? 'OK  ' : 'FAIL'} ${c.what}${c.detail ? ` — ${c.detail}` : ''}`)
console.log(`${stale ? 'STALE' : 'OK  '} copy matches working tree${stale ? ` — copied at ${inst.fingerprint.head.slice(0, 8)}/${inst.fingerprint.digest}, tree is now ${now.head.slice(0, 8)}/${now.digest}; run down + up to test your latest edits` : ''}`)
console.log(`dashboard ${inst.dashboardUrl}  control ${inst.controlUrl}  evidence ${inst.evidence}`)
process.exit(checks.every((c) => c.ok) ? 0 : 1)
