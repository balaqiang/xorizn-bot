/**
 * Integrasi OpenCode (v2) — bot WhatsApp ⇄ server OpenCode di komputer ⇄ 9router / provider lain.
 *
 * Server ditemukan otomatis dari ~/.local/state/opencode/service.json (dibuat oleh
 * `opencode serve --service` / aplikasi desktop), atau diisi manual di config/config.json → opencode.
 * Autentikasi: HTTP Basic, username "opencode" + password service.
 *
 * Setiap pengguna WhatsApp punya state sendiri (sesi aktif, model, effort/variant, agent)
 * yang disimpan di koleksi database "opencode".
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import bot from '../core/bot.js'
import logger from '../core/logger.js'
import { userPart } from '../core/jid.js'

const log = logger.child('opencode')

export const DEFAULT_OPENCODE = {
  enabled: true,
  url: '', // kosong = otomatis dari service OpenCode
  username: 'opencode',
  password: '', // kosong = otomatis dari service.json
  directory: '', // folder kerja sesi; kosong = data/opencode-workspace
  defaultModel: '', // "provider/model" mis. "9router/gemini/gemini-3.5-flash-lite"; kosong = default OpenCode
  defaultVariant: '',
  defaultAgent: 'build',
  access: 'owner', // owner | premium | all
  permissionMode: 'safe', // safe | ask | full
  timeoutSec: 300
}

/** Aturan izin sesi per mode. Rule terakhir yang cocok menang. */
export const PERMISSION_PRESETS = {
  // baca & cari boleh; perintah shell, edit file, akses di luar folder kerja ditolak
  safe: [
    { action: '*', resource: '*', effect: 'allow' },
    { action: 'shell', resource: '*', effect: 'deny' },
    { action: 'edit', resource: '*', effect: 'deny' },
    { action: 'external_directory', resource: '*', effect: 'deny' }
  ],
  // shell / edit / folder luar ditanyakan ke owner lewat WhatsApp (.ocizin)
  ask: [
    { action: '*', resource: '*', effect: 'allow' },
    { action: 'shell', resource: '*', effect: 'ask' },
    { action: 'edit', resource: '*', effect: 'ask' },
    { action: 'external_directory', resource: '*', effect: 'ask' }
  ],
  // semua diizinkan (hati-hati: AI bisa menjalankan perintah di komputermu)
  full: [{ action: '*', resource: '*', effect: 'allow' }]
}

export function ocConfig() {
  return { ...DEFAULT_OPENCODE, ...(bot.config?.opencode || {}), ...(bot.settings?.opencode || {}) }
}

/** "9router/gemini/x#high" → { providerID: '9router', id: 'gemini/x', variant: 'high' } */
export function parseModel(selector) {
  if (!selector) return null
  const [main, variant] = String(selector).trim().split('#')
  const i = main.indexOf('/')
  if (i <= 0) return null
  return { providerID: main.slice(0, i), id: main.slice(i + 1), ...(variant ? { variant } : {}) }
}
export const modelKey = (m) => (m ? `${m.providerID}/${m.id}` : '')

function readServiceFiles() {
  const home = os.homedir()
  const candidates = [path.join(home, '.local', 'state', 'opencode', 'service.json'), path.join(home, '.config', 'opencode', 'service.json')]
  const out = {}
  for (const f of candidates) {
    try {
      const j = JSON.parse(fs.readFileSync(f, 'utf8'))
      if (!out.url && j.url) out.url = j.url
      if (!out.password && j.password) out.password = j.password
    } catch {}
  }
  return out
}

export class OpenCodeError extends Error {
  constructor(message, status, body) {
    super(message)
    this.status = status
    this.body = body
  }
}

class OpenCodeClient {
  endpoint() {
    const cfg = ocConfig()
    const svc = cfg.url && cfg.password ? {} : readServiceFiles()
    const url = String(cfg.url || svc.url || 'http://127.0.0.1:4096').replace(/\/+$/, '')
    const password = cfg.password || svc.password || ''
    return { url, auth: password ? 'Basic ' + Buffer.from(`${cfg.username || 'opencode'}:${password}`).toString('base64') : null }
  }

  async request(method, p, body, { timeout = 30_000 } = {}) {
    const { url, auth } = this.endpoint()
    let res
    try {
      res = await fetch(url + p, {
        method,
        headers: { ...(auth ? { authorization: auth } : {}), ...(body !== undefined ? { 'content-type': 'application/json' } : {}) },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(timeout)
      })
    } catch (err) {
      throw new OpenCodeError(`Server OpenCode tidak bisa dihubungi di ${url} (${err.cause?.code || err.message}). Pastikan OpenCode sedang berjalan — owner bisa menyalakannya dengan .ocstart atau tombol di dashboard.`, 0)
    }
    const text = await res.text()
    let data
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      data = text
    }
    if (!res.ok) {
      const msg = data?.message || data?.error || text
      if (res.status === 401) throw new OpenCodeError('Password server OpenCode salah / belum diatur.', 401, data)
      throw new OpenCodeError(`OpenCode ${res.status}: ${String(msg).slice(0, 300)}`, res.status, data)
    }
    return data
  }

  info() { return this.request('GET', '/api/info', undefined, { timeout: 5000 }) }
  models() { return this.request('GET', '/api/model').then((r) => r.data) }
  defaultModel() { return this.request('GET', '/api/model/default').then((r) => r.data) }
  agents() { return this.request('GET', '/api/agent').then((r) => r.data) }
  sessions(limit = 20, search) {
    const q = new URLSearchParams({ limit: String(limit), order: 'desc' })
    if (search) q.set('search', search)
    return this.request('GET', `/api/session?${q}`).then((r) => r.data)
  }
  session(id) { return this.request('GET', `/api/session/${encodeURIComponent(id)}`).then((r) => r.data) }
  createSession(body) { return this.request('POST', '/api/session', body).then((r) => r.data) }
  deleteSession(id) { return this.request('DELETE', `/api/session/${encodeURIComponent(id)}`) }
  switchModel(id, model) { return this.request('POST', `/api/session/${encodeURIComponent(id)}/model`, { model }) }
  switchAgent(id, agent) { return this.request('POST', `/api/session/${encodeURIComponent(id)}/agent`, { agent }) }
  prompt(id, body) { return this.request('POST', `/api/session/${encodeURIComponent(id)}/prompt`, body, { timeout: 120_000 }) }
  interrupt(id) { return this.request('POST', `/api/session/${encodeURIComponent(id)}/interrupt`) }
  messages(id, limit = 30, order = 'desc') {
    return this.request('GET', `/api/session/${encodeURIComponent(id)}/message?limit=${limit}&order=${order}`).then((r) => r.data)
  }
  permissions(id) { return this.request('GET', `/api/session/${encodeURIComponent(id)}/permission`).then((r) => r.data) }
  replyPermission(id, reqId, decision, message) {
    return this.request('POST', `/api/session/${encodeURIComponent(id)}/permission/${encodeURIComponent(reqId)}/reply`, { decision, ...(message ? { message } : {}) })
  }
}

export const opencode = new OpenCodeClient()

// ---------------- state per pengguna ----------------
export function userState(jid) {
  return bot.db.ensure('opencode', userPart(jid), { sessionId: '', model: null, variant: '', agent: '', lastModels: [], lastSessions: [], pendingPermission: null })
}

export function canUse(ctx) {
  const access = ocConfig().access
  if (ctx.isOwner) return true
  if (access === 'all') return true
  if (access === 'premium') return !!ctx.isPremium
  return false
}

/** Mode izin efektif: non-owner selalu "safe". */
export function permissionModeFor(ctx) {
  const mode = ocConfig().permissionMode
  if (!ctx.isOwner) return 'safe'
  return PERMISSION_PRESETS[mode] ? mode : 'safe'
}

export function workspaceDir() {
  const dir = ocConfig().directory || path.join(bot.config.paths.data, 'opencode-workspace')
  fs.mkdirSync(dir, { recursive: true })
  return path.resolve(dir)
}

/** Model aktif pengguna (pilihan user → default bot → default OpenCode). */
export async function effectiveModel(state) {
  if (state.model) return { ...state.model, ...(state.variant ? { variant: state.variant } : {}) }
  const def = parseModel(ocConfig().defaultModel)
  if (def) return { ...def, ...(state.variant || ocConfig().defaultVariant ? { variant: state.variant || ocConfig().defaultVariant } : {}) }
  const d = await opencode.defaultModel().catch(() => null)
  return d ? { providerID: d.providerID, id: d.id, ...(state.variant ? { variant: state.variant } : {}) } : null
}

export async function modelInfo(ref) {
  if (!ref) return null
  const list = await opencode.models()
  return list.find((x) => x.providerID === ref.providerID && x.id === ref.id) || null
}

export async function newSession(ctx, title) {
  const state = userState(ctx.sender)
  const model = await effectiveModel(state)
  const name = title || `WhatsApp • ${ctx.pushName || userPart(ctx.sender)} • ${new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}`
  const s = await opencode.createSession({
    title: name,
    ...(model ? { model } : {}),
    agent: state.agent || ocConfig().defaultAgent || undefined,
    location: { directory: workspaceDir() },
    permissions: PERMISSION_PRESETS[permissionModeFor(ctx)],
    metadata: { source: 'xorizn-bot', user: userPart(ctx.sender) }
  })
  state.sessionId = s.id
  bot.db.save()
  return s
}

export async function ensureSession(ctx) {
  const state = userState(ctx.sender)
  if (state.sessionId) {
    try {
      return await opencode.session(state.sessionId)
    } catch (err) {
      if (err.status !== 404) throw err
    }
  }
  return newSession(ctx)
}

const textOf = (a) => (a?.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('').trim()

/**
 * Kirim prompt dan tunggu sampai agent selesai.
 * @returns {Promise<{ text, tools, error, outcome, tokens, cost, model, ms }>}
 */
export async function runPrompt(sessionId, { text, files }, { onRetry, onPermission, onProgress, timeoutSec } = {}) {
  const started = Date.now()
  const limit = (timeoutSec || ocConfig().timeoutSec || 300) * 1000
  const seen = new Set((await opencode.messages(sessionId, 50)).map((x) => x.id))
  await opencode.prompt(sessionId, { text, ...(files?.length ? { files: files.map(({ uri, name }) => ({ uri, name })) } : {}) })

  const notifiedRetry = new Set()
  const notifiedPerm = new Set()
  let lastProgress = 0
  while (true) {
    await new Promise((r) => setTimeout(r, 1500))
    const fresh = (await opencode.messages(sessionId, 50)).filter((x) => !seen.has(x.id)).reverse()
    const assistants = fresh.filter((x) => x.type === 'assistant')
    const idle = fresh.find((x) => x.type === 'idle')

    for (const a of assistants) {
      if (a.retry && !notifiedRetry.has(`${a.id}:${a.retry.attempt}`)) {
        notifiedRetry.add(`${a.id}:${a.retry.attempt}`)
        await onRetry?.(a.retry)
      }
    }
    try {
      for (const p of await opencode.permissions(sessionId)) {
        if (notifiedPerm.has(p.id)) continue
        notifiedPerm.add(p.id)
        await onPermission?.(p)
      }
    } catch {}
    if (onProgress && Date.now() - lastProgress > 20_000) {
      lastProgress = Date.now()
      await onProgress(assistants)
    }

    if (idle) {
      const tools = assistants.flatMap((a) => (a.content || []).filter((c) => c.type === 'tool').map((c) => ({ name: c.name, status: c.state?.status || c.state?.type || '' })))
      const last = assistants[assistants.length - 1]
      const tokens = assistants.reduce((acc, a) => ({ input: acc.input + (a.tokens?.input || 0), output: acc.output + (a.tokens?.output || 0), reasoning: acc.reasoning + (a.tokens?.reasoning || 0) }), { input: 0, output: 0, reasoning: 0 })
      return {
        text: assistants.map(textOf).filter(Boolean).join('\n\n'),
        tools,
        outcome: idle.outcome,
        error: idle.error || last?.error || null,
        tokens,
        cost: assistants.reduce((s, a) => s + (a.cost || 0), 0),
        model: last?.model || null,
        ms: Date.now() - started
      }
    }
    if (Date.now() - started > limit) {
      await opencode.interrupt(sessionId).catch(() => {})
      return { text: assistants.map(textOf).filter(Boolean).join('\n\n'), tools: [], outcome: 'timeout', error: { message: `Melebihi batas waktu ${Math.round(limit / 1000)} detik, dihentikan.` }, ms: Date.now() - started }
    }
  }
}

/** Ringkas pesan error provider (mis. 429 kuota habis dari 9router / Gemini). */
export function friendlyError(err) {
  const msg = String(err?.message || err || '')
  if (/429|quota|rate.?limit/i.test(msg)) {
    const model = (msg.match(/\[([^\]]+)\]\s*\[429\]/) || [])[1]
    return `⏳ Kuota / rate limit model${model ? ` *${model}*` : ''} habis. Coba model lain dengan *.ocmodel* atau tunggu kuotanya pulih.`
  }
  if (/unavailable/i.test(msg)) return '⚠️ Model sedang tidak tersedia di provider. Pilih model lain dengan *.ocmodel*.'
  if (/401|unauthorized|api key/i.test(msg)) return '🔑 Provider menolak kunci API. Periksa akun/kunci di 9router.'
  return `⚠️ ${msg.slice(0, 400)}`
}

/** Nyalakan server latar belakang OpenCode di komputer ini (`opencode service start`). */
export async function startService() {
  const { spawn } = await import('node:child_process')
  return new Promise((resolve, reject) => {
    // Windows: "opencode" adalah shim .cmd dari npm, jadi perlu shell; perintah dikirim utuh (tanpa args) agar aman
    const proc = process.platform === 'win32'
      ? spawn('opencode service start', { shell: true, windowsHide: true })
      : spawn('opencode', ['service', 'start'])
    let out = ''
    proc.stdout.on('data', (d) => (out += d))
    proc.stderr.on('data', (d) => (out += d))
    const timer = setTimeout(() => {
      proc.kill()
      reject(new Error('opencode service start tidak merespons dalam 60 detik'))
    }, 60_000)
    proc.on('error', (err) => {
      clearTimeout(timer)
      reject(new Error(`Perintah "opencode" tidak ditemukan (${err.code || err.message}). Pasang OpenCode: npm i -g @opencode/cli`))
    })
    proc.on('close', (code) => {
      clearTimeout(timer)
      if (code === 0) resolve(out.trim())
      else reject(new Error(out.trim().slice(0, 300) || `opencode keluar dengan kode ${code}`))
    })
  })
}

export async function status() {
  const ep = opencode.endpoint()
  try {
    const info = await opencode.info()
    return { ok: true, url: ep.url, version: info.version, hostname: info.hostname, hasAuth: !!ep.auth }
  } catch (err) {
    return { ok: false, url: ep.url, error: err.message, hasAuth: !!ep.auth }
  }
}

log.debug('modul opencode dimuat')
