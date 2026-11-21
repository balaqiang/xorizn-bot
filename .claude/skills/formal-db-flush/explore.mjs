// Exhaustive schedule explorer for the real Database class (src/core/database/index.js).
//
// It does not model the code: it imports the real class, swaps in fake timers and a fake driver whose
// save() promises the explorer resolves itself, and then tries EVERY order of these events up to --depth:
//   set:a / set:b / del:a   app code writes or deletes a document (db.set / db.delete → save() debounce)
//   tick                    the 10 s setInterval fires → flush()
//   debounce                the 2 s debounce setTimeout fires → flush()
//   done:N / fail:N         the driver finishes / rejects save #N
//   close                   lifecycle shutdown calls db.close()
// After each event every microtask is drained, so the async code runs to its next await on the driver.
//
// Properties (see SKILL.md for the plain-language versions):
//   P1 close-durable   when close() resolves, the store holds what memory held when close() was called
//                      (exempt: a save rejected after close() — that loss is logged as "flush terakhir gagal")
//   P2 converges       if the app stops writing and the bot keeps running, the store ends equal to memory
//   P3 one-writer      never more than one driver.save() in flight
//
// Usage: node .claude/skills/formal-db-flush/explore.mjs [--depth 8] [--driver json|rows] [--src path/to/index.js] [--all] [--no-dedupe]
// Exit 0 = no violation in scope, 1 = violation (shortest counterexample printed per property), 2 = harness error.
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const REPO = path.resolve(HERE, '..', '..', '..')
const argv = process.argv.slice(2)
const opt = (k, d) => (argv.includes(`--${k}`) ? argv[argv.indexOf(`--${k}`) + 1] : d)
const DEPTH = Number(opt('depth', 8))
const KINDS = opt('driver') ? [opt('driver')] : ['json', 'rows']
const SRC = path.resolve(REPO, opt('src', 'src/core/database/index.js'))
const SHOW_ALL = argv.includes('--all')
const DEDUPE = !argv.includes('--no-dedupe') // --no-dedupe: plain tree search, to cross-check the state signature
const MAX_WRITES = 3
const MAX_TICKS = 2
const MAX_FAILS = 1

// ---------- fake timers (the Database reads the globals at call time) ----------
const timers = new Map()
let timerSeq = 0
const mkTimer = (kind) => (fn) => {
  const t = { id: ++timerSeq, kind, fn, unref: () => t, ref: () => t, hasRef: () => false }
  timers.set(t.id, t)
  return t
}
globalThis.setTimeout = mkTimer('timeout')
globalThis.setInterval = mkTimer('interval')
globalThis.clearTimeout = globalThis.clearInterval = (t) => t && timers.delete(t.id)
const drain = () => new Promise((r) => setImmediate(r))

const { default: logger } = await import(pathToFileURL(path.join(REPO, 'src/core/logger.js')).href)
logger.silentScopes.add('db') // "gagal menyimpan" logs are expected on fail:N paths
const { Database } = await import(pathToFileURL(SRC).href)

// ---------- world ----------
const SEP = '/'
function view(data) {
  // what a full JSON dump of `data` contains: collection/id → JSON, undefined values dropped
  const m = new Map()
  for (const [c, docs] of Object.entries(data || {})) for (const [id, v] of Object.entries(docs || {})) if (v !== undefined) m.set(c + SEP + id, JSON.stringify(v))
  return m
}
const show = (m) => (m.size ? [...m].sort().map(([k, v]) => `${k.split(SEP)[1]}=${JSON.parse(v).v}`).join(',') : '∅')
const same = (a, b) => a.size === b.size && [...a].every(([k, v]) => b.get(k) === v)

async function boot(kind) {
  timers.clear()
  const w = { kind, store: new Map(), inflight: [], saves: 0, ver: 0, writes: 0, ticks: 0, fails: 0, violations: [], trace: [] }
  w.driver = {
    name: `fake-${kind}`,
    async connect() {},
    async load() {
      return []
    },
    async close() {
      w.driverClosed = true
    },
    save({ upserts, deletes, data }) {
      const s = { id: ++w.saves, afterClose: !!w.driverClosed, sig: kind === 'json' ? show(view(data)) : JSON.stringify([upserts, deletes]) }
      // json driver: JSON.stringify(data) runs synchronously inside save() → a full snapshot taken now.
      // sql drivers: apply the given upserts/deletes rows.
      s.apply = kind === 'json' ? ((full) => () => (w.store = new Map(full)))(view(data)) : ((u, d) => () => {
        for (const r of u) w.store.set(r.collection + SEP + r.id, r.data)
        for (const r of d) w.store.delete(r.collection + SEP + r.id)
      })(upserts.map((r) => ({ ...r })), deletes.map((r) => ({ ...r })))
      w.inflight.push(s)
      if (w.inflight.length > 1) w.violations.push({ p: 'P3', why: `save #${s.id} started while save #${w.inflight[0].id} is still in flight` })
      w.trace.push(`    driver.save #${s.id} started (${kind === 'json' ? `snapshot ${show(view(data))}` : `${upserts.length} upserts, ${deletes.length} deletes`})${s.afterClose ? ' AFTER driver.close()' : ''}`)
      return new Promise((res, rej) => Object.assign(s, { res, rej }))
    }
  }
  w.db = new Database(w.driver, { flushInterval: 10_000 })
  await w.db.init()
  return w
}

const timerOf = (kind) => [...timers.values()].find((t) => t.kind === kind)

function enabled(w) {
  const a = []
  if (!w.closeCalled && w.writes < MAX_WRITES) a.push('set:a', 'set:b', 'del:a')
  if (timerOf('interval') && w.ticks < MAX_TICKS) a.push('tick')
  if (timerOf('timeout')) a.push('debounce')
  for (const s of w.inflight) {
    a.push(`done:${s.id}`)
    if (w.fails < MAX_FAILS) a.push(`fail:${s.id}`)
  }
  if (!w.closeCalled) a.push('close')
  return a
}

async function step(w, act) {
  const [op, arg] = act.split(':')
  const mem = () => show(view(w.db.data))
  if (op === 'set') {
    w.writes++
    w.db.set('users', arg, { v: ++w.ver })
    w.trace.push(`app: db.set('users','${arg}',{v:${w.ver}})  → save() arms the 2 s debounce   [memory ${mem()}]`)
  } else if (op === 'del') {
    w.writes++
    w.db.delete('users', arg)
    w.trace.push(`app: db.delete('users','${arg}')  → save() arms the 2 s debounce   [memory ${mem()}]`)
  } else if (op === 'tick') {
    w.ticks++
    w.trace.push(`timer: 10 s setInterval fires → flush()  (flushing=${!!w.db.flushing}, pending=${w.db.pending})`)
    timerOf('interval').fn()
  } else if (op === 'debounce') {
    const t = timerOf('timeout')
    timers.delete(t.id)
    w.trace.push(`timer: 2 s debounce fires → flush()  (flushing=${!!w.db.flushing}, pending=${w.db.pending})`)
    t.fn()
  } else if (op === 'done' || op === 'fail') {
    const s = w.inflight.find((x) => x.id === Number(arg))
    w.inflight.splice(w.inflight.indexOf(s), 1)
    if (op === 'done') {
      s.apply()
      w.trace.push(`driver: save #${s.id} completes   [store ${show(w.store)}]`)
      s.res()
    } else {
      w.fails++
      if (w.closeCalled) w.failedAfterClose = true
      w.trace.push(`driver: save #${s.id} rejects (e.g. database unreachable)`)
      s.rej(new Error('driver error'))
    }
  } else if (op === 'close') {
    w.closeCalled = true
    w.memAtClose = view(w.db.data)
    w.trace.push(`shutdown: db.close()  (flushing=${!!w.db.flushing}, pending=${w.db.pending})   [memory ${mem()}]`)
    w.db.close().then(() => {
      w.closeResolved = true
      w.trace.push(`    close() RESOLVED → lifecycle.shutdown() calls realExit()   [store ${show(w.store)}]`)
      if (!w.failedAfterClose && !same(w.store, w.memAtClose)) w.violations.push({ p: 'P1', why: `close() resolved with store ${show(w.store)} but memory at close() was ${show(w.memAtClose)}; the process exits now and the difference is lost` })
    })
  }
  await drain()
  await drain()
}

/** Let the bot keep running with no new app writes: saves succeed, timers fire. Then check P2 / close liveness. */
async function settle(w) {
  w.trace.push('— end of schedule: app stops writing, bot keeps running (saves succeed, timers fire) —')
  for (let round = 0; round < 8; round++) {
    while (w.inflight.length) await step(w, `done:${w.inflight[0].id}`)
    if (timerOf('timeout')) await step(w, 'debounce')
    else if (timerOf('interval') && round < 3) {
      timerOf('interval').fn()
      await drain()
      await drain()
    } else if (!w.inflight.length) break
  }
  if (!w.closeCalled && !same(w.store, view(w.db.data))) w.violations.push({ p: 'P2', why: `bot idle and all saves succeeded, yet store ${show(w.store)} ≠ memory ${show(view(w.db.data))}` })
  if (w.closeCalled && !w.closeResolved) w.violations.push({ p: 'close-hangs', why: 'close() never resolved with every save completed' })
}

async function run(kind, path, { withSettle }) {
  const w = await boot(kind)
  for (const act of path) await step(w, act)
  const next = enabled(w)
  const sig = signature(w)
  if (withSettle) await settle(w)
  return { w, next, sig }
}

// Everything that decides the future: memory, the Database's own fields, driver state, timers, bounds.
function signature(w) {
  const db = w.db
  return JSON.stringify([
    [...view(db.data)], [...db.snapshot], [...w.store], !!db.flushing, db.pending, !!timerOf('timeout'), !!timerOf('interval'),
    w.inflight.map((s) => [s.id, s.sig, s.afterClose]), !!w.driverClosed, w.closeCalled, w.closeResolved, w.failedAfterClose, w.writes, w.ticks, w.fails,
    w.violations.map((v) => v.p)
  ])
}

let exitCode = 0
const t0 = Date.now()
for (const kind of KINDS) {
  const found = new Map() // property → shortest {path, trace, why}
  const seen = new Set()
  let runs = 0
  let frontier = [[]]
  for (let d = 0; d <= DEPTH && frontier.length; d++) {
    const next = []
    for (const p of frontier) {
      runs++
      const { next: acts, sig } = await run(kind, p, { withSettle: false })
      if (DEDUPE && seen.has(sig)) continue
      seen.add(sig)
      const { w } = await run(kind, p, { withSettle: true })
      for (const v of w.violations) if (!found.has(v.p)) found.set(v.p, { path: p, trace: w.trace, why: v.why })
      if (d < DEPTH) for (const a of acts) next.push([...p, a])
    }
    frontier = next
  }
  const status = found.size ? 'VIOLATED' : 'OK'
  console.log(`\n=== driver=${kind}  depth=${DEPTH}  writes≤${MAX_WRITES} ticks≤${MAX_TICKS} fails≤${MAX_FAILS}  states=${seen.size} runs=${runs}  → ${status}`)
  for (const p of ['P1', 'P2', 'P3', 'close-hangs']) {
    const f = found.get(p)
    console.log(`  ${f ? 'FAIL' : 'ok  '} ${p}`)
    if (f) {
      console.log(`       ${f.why}`)
      console.log(`       shortest schedule (${f.path.length} events): ${f.path.join(' → ') || '(none)'}`)
      if (SHOW_ALL || p !== 'P3') for (const line of f.trace) console.log(`         ${line}`)
    }
  }
  if (found.size) exitCode = 1
}
console.log(`\n${((Date.now() - t0) / 1000).toFixed(1)} s, source ${path.relative(REPO, SRC)}`)
process.exit(exitCode)
