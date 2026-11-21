// Shared helpers for the verify-xorizn-bot scripts. Plain Node (>=22), no extra deps.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import net from 'node:net'
import nodeHttp from 'node:http'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

export const SKILL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const REPO = path.resolve(SKILL_DIR, '..', '..', '..')
export const INSTANCES = path.join(fs.realpathSync.native(os.tmpdir()), 'xorizn-verify')
export const EVIDENCE_ROOT = path.join(REPO, '.verify', 'evidence')

// Fixture numbers. OWNER is seeded as bot owner through config.json → bot.owners.
export const FIXTURE = {
  botNumber: '6281100000000',
  owner: '6289990000000',
  user: '6289990000001',
  admin: '6289990000002',
  group: '120363999000000001@g.us'
}

/** --flag value | --flag=value | --flag (boolean when listed in `booleans` or last). Repeated flags become arrays. */
export function parseArgs(booleans = [], argv = process.argv.slice(2)) {
  const out = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (!a.startsWith('--')) {
      out._.push(a)
      continue
    }
    const [k, inline] = a.slice(2).split(/=(.*)/s, 2)
    const next = argv[i + 1]
    let v
    if (inline !== undefined) v = inline
    else if (!booleans.includes(k) && next !== undefined && !next.startsWith('--')) v = argv[++i]
    else v = true
    if (k in out && k !== '_') out[k] = [].concat(out[k], v)
    else out[k] = v
  }
  return out
}

export const instanceDir = (name) => path.join(INSTANCES, name)
export const instanceFile = (name) => path.join(instanceDir(name), 'instance.json')

export function readInstance(name) {
  const f = instanceFile(name)
  if (!fs.existsSync(f)) throw new Error(`no instance "${name}" (missing ${f}). Run: node ${path.relative(REPO, path.join(SKILL_DIR, 'scripts', 'up.mjs'))} --name ${name}`)
  return JSON.parse(fs.readFileSync(f, 'utf8'))
}

export function evidenceDir(name) {
  const d = path.join(EVIDENCE_ROOT, name)
  fs.mkdirSync(d, { recursive: true })
  return d
}

/** Next free numbered file in the evidence dir: 003-chat-ping.json */
export function nextEvidencePath(name, label, ext) {
  const d = evidenceDir(name)
  const n = fs.readdirSync(d).filter((f) => /^\d{3}-/.test(f)).length + 1
  const slug = String(label).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'step'
  return path.join(d, `${String(n).padStart(3, '0')}-${slug}.${ext}`)
}

export function freePort() {
  return new Promise((resolve, reject) => {
    const s = net.createServer()
    s.unref()
    s.on('error', reject)
    s.listen(0, '127.0.0.1', () => {
      const { port } = s.address()
      s.close(() => resolve(port))
    })
  })
}

export function pidAlive(pid) {
  try {
    process.kill(pid, 0)
    return true
  } catch (err) {
    return err.code === 'EPERM'
  }
}

/** PID listening on 127.0.0.1:port, or null. */
export function portOwner(port) {
  try {
    if (process.platform === 'win32') {
      const out = execFileSync('netstat', ['-ano', '-p', 'TCP'], { encoding: 'utf8' })
      for (const line of out.split(/\r?\n/)) {
        const cols = line.trim().split(/\s+/)
        if (cols[0] === 'TCP' && cols[1]?.endsWith(`:${port}`) && cols[3] === 'LISTENING') return Number(cols[4])
      }
      return null
    }
    const out = execFileSync('lsof', ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN', '-t'], { encoding: 'utf8' })
    return Number(out.trim().split('\n')[0]) || null
  } catch {
    return null
  }
}

export function git(args, cwd = REPO) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] })
}

/** Fingerprint of the working tree the copy was made from (HEAD + uncommitted diff + untracked list). */
// The copy leaves out .claude/ (agent tooling, incl. this skill) and .verify/ (evidence), so the fingerprint does too.
const APP_PATHS = ['--', '.', ':(exclude).claude', ':(exclude).verify']
export function treeFingerprint() {
  const head = git(['rev-parse', 'HEAD']).trim()
  const status = git(['status', '--porcelain', '--untracked-files=all', ...APP_PATHS])
  const diff = git(['diff', 'HEAD', '--binary', ...APP_PATHS])
  const untracked = git(['ls-files', '-o', '--exclude-standard', '-z', ...APP_PATHS]).split('\0').filter(Boolean)
  const h = createHash('sha1')
  h.update(head).update(status).update(diff)
  for (const f of untracked) {
    try {
      h.update(f).update(fs.readFileSync(path.join(REPO, f)))
    } catch {}
  }
  return { head, digest: h.digest('hex').slice(0, 16) }
}

/** Small HTTP client on node:http with no keep-alive, so scripts exit as soon as they are done. */
export function http(method, url, { body, cookie, headers = {}, timeoutMs = 60_000 } = {}) {
  return new Promise((resolve, reject) => {
    const data = body === undefined ? null : Buffer.from(JSON.stringify(body))
    const req = nodeHttp.request(url, {
      method,
      agent: false,
      timeout: timeoutMs,
      headers: { 'content-type': 'application/json', ...(data ? { 'content-length': data.length } : {}), ...(cookie ? { cookie } : {}), ...headers }
    })
    req.on('timeout', () => req.destroy(new Error(`timeout after ${timeoutMs}ms: ${method} ${url}`)))
    req.on('error', reject)
    req.on('response', (res) => {
      const chunks = []
      res.on('data', (c) => chunks.push(c))
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8')
        let json = null
        try {
          json = JSON.parse(text)
        } catch {}
        resolve({ status: res.statusCode, json, text, headers: res.headers })
      })
    })
    req.end(data)
  })
}

/** Log in to the instance dashboard through POST /api/login (the same call the login page makes). */
export async function login(inst) {
  const r = await http('POST', `${inst.dashboardUrl}/api/login`, { body: { password: inst.password } })
  if (r.status !== 200) throw new Error(`login failed: ${r.status} ${r.text}`)
  const sid = /sid=([^;]+)/.exec([].concat(r.headers['set-cookie'] || []).join(';'))?.[1]
  return `sid=${sid}`
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
