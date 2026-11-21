/**
 * Dashboard localhost: REST API + Server-Sent Events + SPA statis (src/dashboard/public).
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import express from 'express'
import bot from '../core/bot.js'
import logger from '../core/logger.js'
import { saveConfigPatch } from '../core/config.js'
import { DEFAULT_GROUP, getGroup, getUser, isPremium } from '../core/models.js'
import { DRIVERS, createDriver } from '../core/database/index.js'
import { requestPairing, logout as waLogout, restartSocket, refreshGroups, resolveChannel } from '../core/connection.js'
import { sendGreeting } from '../features/greetings.js'
import { renderCard, engine as cardEngine } from '../features/welcome-card.js'
import { participantPn, userPart, digits, toPnJid } from '../core/jid.js'
import { restart } from '../core/lifecycle.js'
import { loadNativePlugins } from '../core/loader.js'
import * as builder from '../features/builder/index.js'
import { LIMITS, STEP_TYPES } from '../features/builder/runner.js'
import { listSecrets, setSecret, deleteSecret } from '../features/builder/secrets.js'
import * as integ from '../features/integrations.js'

const log = logger.child('dashboard')
// Hasil build statis dashboard Next.js + TailAdmin (folder dashboard/). Build: npm run build:dashboard
const PUBLIC = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'dashboard', 'out')
/** Sesi login dashboard disimpan di database supaya tetap login setelah restart. */
const sessions = {
  col: () => bot.db.collection('_dashboard_sessions'),
  get(sid) {
    return this.col()[sid]
  },
  set(sid, v) {
    const col = this.col()
    for (const [k, s] of Object.entries(col)) if (s.exp < Date.now()) delete col[k]
    col[sid] = v
    bot.db.save()
  },
  delete(sid) {
    if (sid && this.col()[sid]) {
      delete this.col()[sid]
      bot.db.save()
    }
  }
}
const loginAttempts = new Map()
const SESSION_TTL = 7 * 86_400_000
const recentCommands = []
const pictureCache = new Map()

bot.on('command', (c) => {
  recentCommands.push(c)
  if (recentCommands.length > 50) recentCommands.shift()
})

// ---------- helpers ----------
const pick = (obj, keys) => Object.fromEntries(Object.entries(obj || {}).filter(([k]) => keys.includes(k)))
const asyncRoute = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').map((c) => c.trim().split('=')).filter(([k]) => k).map(([k, ...v]) => [k, decodeURIComponent(v.join('='))]))
}

function requireAuth(req, res, next) {
  const sid = parseCookies(req.headers.cookie).sid
  const s = sid && sessions.get(sid)
  if (!s || s.exp < Date.now()) {
    if (sid) sessions.delete(sid)
    return res.status(401).json({ error: 'Belum login' })
  }
  if (s.exp - Date.now() < SESSION_TTL - 3_600_000) {
    s.exp = Date.now() + SESSION_TTL
    bot.db.save()
  }
  next()
}

function requireConnected(req, res, next) {
  if (!bot.isConnected) return res.status(409).json({ error: 'Bot belum terhubung ke WhatsApp' })
  next()
}

function maskKey(v) {
  if (!v) return ''
  const s = String(v)
  return s.length <= 6 ? '••••' : `${s.slice(0, 3)}••••${s.slice(-3)}`
}

/** postgresql://user:rahasia@host/db → postgresql://user:••••••@host/db */
function maskConnString(v) {
  if (!v) return ''
  // dipotong manual (bukan URL) supaya "••" tetap utuh dan bisa dikenali saat disimpan ulang;
  // sampai '@' TERAKHIR agar password yang memuat '@' tidak ikut bocor
  const s = String(v)
  const i = s.indexOf('://')
  const at = s.lastIndexOf('@')
  if (i < 0 || at <= i) return s
  const userinfo = s.slice(i + 3, at)
  const user = userinfo.split(':')[0]
  return `${s.slice(0, i + 3)}${user}${userinfo.includes(':') ? ':••••••' : ''}${s.slice(at)}`
}

function dailySeries(days = 14) {
  const daily = bot.db.get('stats', 'daily') || {}
  const out = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10)
    out.push({ date: d, messages: daily[d] || 0, commands: daily[`${d}:cmd`] || 0 })
  }
  return out
}

function groupSummary(meta, doc) {
  const me = [bot.sock?.user?.id, bot.sock?.user?.lid].filter(Boolean).map(userPart)
  const botP = (meta?.participants || []).find((p) => [p.id, p.lid, p.phoneNumber].filter(Boolean).map(userPart).some((u) => me.includes(u)))
  return {
    id: meta?.id || doc?.id,
    subject: meta?.subject || doc?.name || '(tanpa nama)',
    size: meta?.participants?.length ?? meta?.size ?? 0,
    announce: !!meta?.announce,
    restrict: !!meta?.restrict,
    creation: meta?.creation || 0,
    botAdmin: !!botP?.admin,
    settings: pick(doc, ['botEnabled', 'welcome', 'goodbye', 'antilink', 'antiBadword', 'nsfw', 'onlyAdmin', 'stats'])
  }
}

function commandRows() {
  const usage = bot.db.get('stats', 'commands') || {}
  const disabled = new Set(bot.settings.disabledCommands || [])
  const rows = []
  for (const e of bot.registry.entries.values()) {
    const active = bot.registry.resolve(e.name)
    const providers = bot.registry.providers(e.name).map((p) => p.source)
    rows.push({
      id: e.id,
      name: e.name,
      aliases: e.aliases.filter((a) => a !== e.name),
      category: e.category,
      source: e.source,
      description: e.description,
      usage: e.usage,
      flags: e.flags,
      file: e.file,
      active: active?.id === e.id,
      providers,
      disabled: e.aliases.some((a) => disabled.has(a)),
      uses: usage[e.name] || 0
    })
  }
  return rows.sort((a, b) => a.name.localeCompare(b.name))
}

const SETTINGS_KEYS = [
  'botName', 'ownerName', 'owners', 'prefixes', 'noPrefix', 'mode', 'autoRead', 'autoTyping', 'alwaysOnline', 'antiCall',
  'antiCallMessage', 'cooldown', 'packname', 'author', 'footer', 'thumbnail', 'timezone', 'welcomeText', 'goodbyeText',
  'welcomeBackground', 'welcomeColor', 'goodbyeColor', 'providerOrder', 'autoResponses', 'commandProviders', 'disabledCommands',
  'website', 'channel', 'requireRegister', 'limit', 'ai', 'downloader'
]

/** Pengaturan untuk dikirim ke browser: tanpa rahasia (API key AI hanya ditandai tersimpan/tidak). */
function publicSettings() {
  const { opencode: _oc, ai, ...settings } = bot.settings
  const { apiKey, ...aiRest } = ai || {}
  return { ...settings, ai: { ...aiRest, apiKeySet: !!apiKey } }
}
const clampNum = (v, min, max, def) => {
  const n = Number(v)
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : def
}
const GROUP_KEYS = Object.keys(DEFAULT_GROUP).filter((k) => !['stats', 'joinedAt', 'name'].includes(k))

// ---------- app ----------
export async function startDashboard() {
  const { host, port, password } = bot.config.dashboard
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json({ limit: '40mb' }))
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('Referrer-Policy', 'no-referrer')
    next()
  })

  // ----- auth -----
  app.get('/api/session', (req, res) => {
    const sid = parseCookies(req.headers.cookie).sid
    res.json({ authenticated: !!(sid && sessions.get(sid)?.exp > Date.now()), botName: bot.settings.botName })
  })
  app.post('/api/login', (req, res) => {
    const ip = req.socket.remoteAddress
    const tries = (loginAttempts.get(ip) || []).filter((t) => Date.now() - t < 10 * 60_000)
    if (tries.length >= 10) return res.status(429).json({ error: 'Terlalu banyak percobaan. Tunggu 10 menit.' })
    const a = Buffer.from(String(req.body?.password || ''))
    const b = Buffer.from(String(password))
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      tries.push(Date.now())
      loginAttempts.set(ip, tries)
      return res.status(401).json({ error: 'Password salah' })
    }
    loginAttempts.delete(ip)
    const sid = crypto.randomBytes(24).toString('hex')
    sessions.set(sid, { exp: Date.now() + SESSION_TTL })
    res.setHeader('Set-Cookie', `sid=${sid}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL / 1000}`)
    res.json({ ok: true })
  })
  app.post('/api/logout', (req, res) => {
    sessions.delete(parseCookies(req.headers.cookie).sid)
    res.setHeader('Set-Cookie', 'sid=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0')
    res.json({ ok: true })
  })

  // ----- API v1 untuk n8n / aplikasi lain (token, bukan sesi dashboard) -----
  app.use('/api/v1', (req, res, next) => {
    const check = integ.checkToken(req)
    if (!check.ok) return res.status(check.code).json({ ok: false, error: check.error })
    next()
  })
  app.get('/api/v1/status', (req, res) => {
    res.json({ ok: true, connection: bot.status.connection, me: bot.status.me || null, uptime: Date.now() - bot.startedAt, bot: bot.settings.botName })
  })
  app.get('/api/v1/groups', (req, res) => {
    res.json({ ok: true, groups: bot.groupCache.list().map((g) => ({ id: g.id, name: g.subject, size: g.participants?.length || g.size || 0 })) })
  })
  app.post('/api/v1/send', asyncRoute(async (req, res) => {
    if (!bot.sock || bot.status.connection !== 'open') return res.status(503).json({ ok: false, error: 'Bot belum tersambung ke WhatsApp.' })
    const jid = integ.toJid(req.body?.to)
    if (!jid) return res.status(400).json({ ok: false, error: 'Field "to" harus nomor (628xxx), JID pengguna, atau JID grup.' })
    const content = integ.contentFromBody(req.body || {})
    if (!content) return res.status(400).json({ ok: false, error: 'Isi salah satu: text, image, video, audio, document, sticker.' })
    const sent = await bot.sock.sendMessage(jid, content)
    res.json({ ok: true, to: jid, id: sent?.key?.id || null })
  }))

  app.use('/api', requireAuth)

  // ----- overview -----
  app.get('/api/overview', asyncRoute(async (req, res) => {
    const usage = bot.db.get('stats', 'commands') || {}
    const top = Object.entries(usage).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, count }))
    const users = bot.db.collection('users')
    const groups = bot.db.collection('groups')
    const mem = process.memoryUsage()
    res.json({
      status: bot.status,
      settings: { botName: bot.settings.botName, mode: bot.settings.mode, prefixes: bot.settings.prefixes, owners: bot.settings.owners },
      uptime: Date.now() - bot.startedAt,
      runtime: bot.runtime,
      counts: {
        groups: bot.isConnected ? bot.groupCache.list().length : Object.keys(groups).length,
        users: Object.keys(users).length,
        premium: Object.values(users).filter((u) => u.premium).length,
        banned: Object.values(users).filter((u) => u.banned).length,
        commands: bot.registry.active().length,
        sources: bot.registry.counts(),
        conflicts: bot.registry.conflicts().length
      },
      daily: dailySeries(14),
      top,
      recent: recentCommands.slice(-15).reverse(),
      system: {
        node: process.version,
        platform: `${os.platform()} ${os.arch()}`,
        cpu: os.cpus()?.[0]?.model || '',
        rss: mem.rss,
        heap: mem.heapUsed,
        totalmem: os.totalmem(),
        freemem: os.freemem(),
        load: os.loadavg()
      },
      database: bot.db.stats(),
      dbError: bot.dbError || null,
      cardEngine: cardEngine(),
      opencode: await (await import('../features/opencode.js')).status()
    })
  }))

  // ----- realtime -----
  app.get('/api/events', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' })
    const send = (type, data) => res.write(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`)
    send('status', bot.status)
    const onStatus = (s) => send('status', s)
    const onLog = (e) => send('log', e)
    const onCmd = (c) => send('command', c)
    const onGroups = () => send('groups', {})
    bot.on('status', onStatus)
    logger.on('entry', onLog)
    bot.on('command', onCmd)
    bot.on('groups', onGroups)
    const ping = setInterval(() => res.write(': ping\n\n'), 25_000)
    req.on('close', () => {
      clearInterval(ping)
      bot.off('status', onStatus)
      logger.off('entry', onLog)
      bot.off('command', onCmd)
      bot.off('groups', onGroups)
    })
  })
  app.get('/api/logs', (req, res) => res.json(logger.recent(Number(req.query.limit) || 300, req.query.level || undefined)))

  // ----- connection -----
  app.post('/api/connection/pair', asyncRoute(async (req, res) => {
    const code = await requestPairing(req.body?.number)
    res.json({ code })
  }))
  app.post('/api/connection/logout', asyncRoute(async (req, res) => {
    await waLogout()
    res.json({ ok: true })
  }))
  app.post('/api/connection/reconnect', asyncRoute(async (req, res) => {
    await restartSocket()
    res.json({ ok: true })
  }))
  app.post('/api/system/restart', (req, res) => {
    res.json({ ok: true, launcher: !!process.env.BOT_LAUNCHER })
    setTimeout(() => restart(), 300)
  })

  // ----- groups -----
  app.get('/api/groups', asyncRoute(async (req, res) => {
    const docs = bot.db.collection('groups')
    let metas = []
    if (bot.isConnected) metas = await bot.groupCache.all(bot.sock, req.query.refresh === '1').catch(() => bot.groupCache.list())
    const list = metas.length ? metas.map((meta) => groupSummary(meta, getGroup(meta.id))) : Object.entries(docs).map(([id, d]) => groupSummary({ id, subject: d.name }, d))
    res.json({ connected: bot.isConnected, groups: list.sort((a, b) => b.size - a.size) })
  }))
  app.get('/api/groups/:id', asyncRoute(async (req, res) => {
    const id = req.params.id
    if (!id.endsWith('@g.us')) return res.status(400).json({ error: 'id grup tidak valid' })
    let meta = null
    if (bot.isConnected) meta = await bot.groupCache.get(bot.sock, id, req.query.refresh === '1').catch(() => null)
    const doc = getGroup(id)
    const participants = (meta?.participants || []).map((p) => {
      const jid = participantPn(p)
      const u = bot.db.get('users', jid)
      return { id: p.id, jid, number: userPart(jid), name: u?.name || '', admin: p.admin || null, warns: doc.warns[userPart(jid)] || 0 }
    })
    res.json({
      summary: groupSummary(meta || { id, subject: doc.name }, doc),
      meta: meta ? { desc: meta.desc || '', owner: meta.ownerPn || meta.owner || '', creation: meta.creation, announce: meta.announce, restrict: meta.restrict, joinApprovalMode: meta.joinApprovalMode, memberAddMode: meta.memberAddMode, ephemeralDuration: meta.ephemeralDuration } : null,
      participants,
      settings: doc,
      defaults: { welcomeText: bot.settings.welcomeText, goodbyeText: bot.settings.goodbyeText }
    })
  }))
  app.get('/api/groups/:id/picture', asyncRoute(async (req, res) => {
    const id = req.params.id
    const hit = pictureCache.get(id)
    let url = hit && Date.now() - hit.at < 3_600_000 ? hit.url : undefined
    if (url === undefined && bot.isConnected) {
      url = await bot.sock.profilePictureUrl(id, 'image').catch(() => null)
      pictureCache.set(id, { url, at: Date.now() })
    }
    if (!url) return res.status(404).end()
    res.redirect(url)
  }))
  app.patch('/api/groups/:id/settings', (req, res) => {
    const doc = getGroup(req.params.id)
    const patch = pick(req.body, GROUP_KEYS)
    if (patch.antilink && !['off', 'wa', 'all'].includes(patch.antilink)) return res.status(400).json({ error: 'antilink harus off/wa/all' })
    if (patch.antilinkAction && !['delete', 'warn', 'kick'].includes(patch.antilinkAction)) return res.status(400).json({ error: 'aksi tidak valid' })
    if (patch.warnLimit !== undefined) patch.warnLimit = Math.min(20, Math.max(1, Number(patch.warnLimit) || 3))
    if (patch.badwords) patch.badwords = [...new Set([].concat(patch.badwords).map((w) => String(w).toLowerCase().trim()).filter(Boolean))]
    Object.assign(doc, patch)
    bot.db.save()
    res.json({ ok: true, settings: doc })
  })
  app.post('/api/groups/:id/preview/:kind', asyncRoute(async (req, res) => {
    const kind = req.params.kind === 'goodbye' ? 'goodbye' : 'welcome'
    const doc = getGroup(req.params.id)
    const meta = bot.isConnected ? await bot.groupCache.get(bot.sock, req.params.id).catch(() => null) : null
    const me = bot.sock?.user
    const png = await renderCard(kind, {
      username: me?.name || bot.settings.botName,
      number: userPart(me?.id || '0000'),
      groupName: meta?.subject || doc.name || 'Nama Grup',
      memberCount: meta?.participants?.length || 0,
      avatar: me?.id && bot.isConnected ? await bot.sock.profilePictureUrl(me.id, 'image').catch(() => null) : null,
      background: req.body?.background ?? (doc.cardBackground || bot.settings.welcomeBackground),
      color: kind === 'welcome' ? bot.settings.welcomeColor : bot.settings.goodbyeColor
    })
    res.type('png').send(png)
  }))
  app.post('/api/preview/:kind', asyncRoute(async (req, res) => {
    const kind = req.params.kind === 'goodbye' ? 'goodbye' : 'welcome'
    const png = await renderCard(kind, {
      username: req.body?.username || 'Member Baru',
      number: '6281200001234',
      groupName: req.body?.groupName || 'Grup Contoh',
      memberCount: 128,
      background: req.body?.background ?? bot.settings.welcomeBackground,
      color: req.body?.color || (kind === 'welcome' ? bot.settings.welcomeColor : bot.settings.goodbyeColor)
    })
    res.type('png').send(png)
  }))
  app.post('/api/groups/:id/test/:kind', requireConnected, asyncRoute(async (req, res) => {
    const me = bot.sock.user
    await sendGreeting(bot.sock, req.params.id, req.params.kind === 'goodbye' ? 'goodbye' : 'welcome', { id: me.lid || me.id, phoneNumber: me.id })
    res.json({ ok: true })
  }))
  app.post('/api/groups/:id/message', requireConnected, asyncRoute(async (req, res) => {
    const text = String(req.body?.text || '').trim()
    if (!text) return res.status(400).json({ error: 'Pesan kosong' })
    const meta = await bot.groupCache.get(bot.sock, req.params.id).catch(() => null)
    const mentions = req.body?.hidetag ? (meta?.participants || []).map((p) => p.id) : []
    await bot.sock.sendMessage(req.params.id, { text, mentions })
    res.json({ ok: true })
  }))
  app.post('/api/groups/:id/action', requireConnected, asyncRoute(async (req, res) => {
    const { action, participant } = req.body || {}
    const id = req.params.id
    switch (action) {
      case 'open':
        await bot.sock.groupSettingUpdate(id, 'not_announcement')
        break
      case 'close':
        await bot.sock.groupSettingUpdate(id, 'announcement')
        break
      case 'leave':
        await bot.sock.groupLeave(id)
        bot.groupCache.delete(id)
        break
      case 'refresh':
        await bot.groupCache.get(bot.sock, id, true)
        break
      case 'invite':
        return res.json({ ok: true, link: `https://chat.whatsapp.com/${await bot.sock.groupInviteCode(id)}` })
      case 'promote':
      case 'demote':
      case 'remove':
        if (!participant) return res.status(400).json({ error: 'participant wajib' })
        await bot.sock.groupParticipantsUpdate(id, [participant], action)
        await bot.groupCache.get(bot.sock, id, true).catch(() => {})
        break
      default:
        return res.status(400).json({ error: 'aksi tidak dikenal' })
    }
    bot.emit('groups')
    res.json({ ok: true })
  }))
  app.post('/api/groups/join', requireConnected, asyncRoute(async (req, res) => {
    const code = String(req.body?.link || '').match(/chat\.whatsapp\.com\/([A-Za-z0-9]{10,})/)?.[1] || String(req.body?.link || '').trim()
    if (!code) return res.status(400).json({ error: 'Link tidak valid' })
    const id = await bot.sock.groupAcceptInvite(code)
    await refreshGroups(true).catch(() => {})
    res.json({ ok: true, id })
  }))

  // ----- bot settings -----
  app.get('/api/settings', (req, res) => {
    res.json({ settings: publicSettings(), cardEngine: cardEngine() })
  })
  app.patch('/api/settings', (req, res) => {
    const patch = pick(req.body, SETTINGS_KEYS)
    if (patch.owners) patch.owners = [...new Set([].concat(patch.owners).map(digits).filter(Boolean))]
    if (patch.prefixes) patch.prefixes = [...new Set([].concat(patch.prefixes).map((p) => String(p).trim()).filter(Boolean))].slice(0, 10)
    if (patch.prefixes && !patch.prefixes.length) return res.status(400).json({ error: 'Minimal satu prefix' })
    if (patch.mode && !['public', 'self', 'group', 'private'].includes(patch.mode)) return res.status(400).json({ error: 'mode tidak valid' })
    if (patch.cooldown !== undefined) patch.cooldown = Math.min(60, Math.max(0, Number(patch.cooldown) || 0))
    if (patch.channel !== undefined) {
      const cur = bot.settings.channel || {}
      const url = String(patch.channel?.url ?? cur.url ?? '').trim()
      if (url && !/^https:\/\/(www\.)?whatsapp\.com\/channel\/[A-Za-z0-9]+\/?$/.test(url)) return res.status(400).json({ error: 'Link channel harus berbentuk https://whatsapp.com/channel/...' })
      const name = String(patch.channel?.name ?? cur.name ?? '').slice(0, 80)
      // link berubah → JID lama tidak berlaku, diambil ulang saat bot tersambung
      patch.channel = url === cur.url ? { ...cur, name } : { url, name, jid: '' }
    }
    if (patch.requireRegister !== undefined) patch.requireRegister = !!patch.requireRegister
    if (patch.limit !== undefined) {
      const cur = bot.settings.limit || {}
      patch.limit = { enabled: patch.limit?.enabled ?? cur.enabled ?? true, daily: clampNum(patch.limit?.daily ?? cur.daily, 1, 10000, 20) }
    }
    if (patch.downloader !== undefined) {
      const cur = bot.settings.downloader || {}
      const d = patch.downloader || {}
      patch.downloader = { maxMB: clampNum(d.maxMB ?? cur.maxMB, 5, 2000, 100), maxMinutes: clampNum(d.maxMinutes ?? cur.maxMinutes, 1, 600, 30), autoInstall: d.autoInstall ?? cur.autoInstall ?? true }
    }
    if (patch.ai !== undefined) {
      const cur = bot.settings.ai || {}
      const a = patch.ai || {}
      const baseUrl = String(a.baseUrl ?? cur.baseUrl ?? '').trim()
      if (baseUrl && !/^https?:\/\/\S+$/i.test(baseUrl)) return res.status(400).json({ error: 'Base URL AI harus diawali http:// atau https://' })
      patch.ai = {
        baseUrl,
        // API key hanya berubah bila dikirim (string kosong = hapus)
        apiKey: a.apiKey !== undefined ? String(a.apiKey).trim() : cur.apiKey || '',
        model: String(a.model ?? cur.model ?? '').trim(),
        systemPrompt: String(a.systemPrompt ?? cur.systemPrompt ?? '').slice(0, 4000),
        memory: clampNum(a.memory ?? cur.memory, 0, 30, 10)
      }
    }
    bot.saveSettings(patch)
    if (patch.channel && !patch.channel.jid && bot.sock && bot.status?.connection === 'open') resolveChannel(bot.sock).catch(() => {})
    res.json({ ok: true, settings: publicSettings() })
  })

  // ----- perintah kustom (no-code) -----
  const builderError = (res, err) => res.status(400).json({ error: err?.message || String(err) })
  app.get('/api/custom', (req, res) => {
    res.json({ commands: builder.list(), secrets: listSecrets(), allowHosts: bot.settings.builder?.allowHosts || [], limits: LIMITS, stepTypes: STEP_TYPES })
  })
  app.post('/api/custom', (req, res) => {
    try {
      const doc = builder.save(req.body?.command, { override: !!req.body?.override, previousName: req.body?.previousName || null })
      res.json({ ok: true, command: doc })
    } catch (err) {
      builderError(res, err)
    }
  })
  app.post('/api/custom/test', asyncRoute(async (req, res) => {
    try {
      const out = await builder.test(req.body?.command, { text: String(req.body?.text || ''), isGroup: !!req.body?.isGroup })
      res.json(out)
    } catch (err) {
      builderError(res, err)
    }
  }))
  app.patch('/api/custom/:name', (req, res) => {
    const doc = builder.setEnabled(req.params.name, !!req.body?.enabled)
    if (!doc) return res.status(404).json({ error: 'Perintah tidak ditemukan' })
    res.json({ ok: true, command: doc })
  })
  app.delete('/api/custom/:name', (req, res) => {
    if (!builder.remove(req.params.name)) return res.status(404).json({ error: 'Perintah tidak ditemukan' })
    res.json({ ok: true })
  })
  app.put('/api/secrets/:name', (req, res) => {
    try {
      setSecret(String(req.params.name || ''), req.body?.value)
      res.json({ ok: true, secrets: listSecrets() })
    } catch (err) {
      builderError(res, err)
    }
  })
  app.delete('/api/secrets/:name', (req, res) => {
    deleteSecret(String(req.params.name || ''))
    res.json({ ok: true, secrets: listSecrets() })
  })
  app.patch('/api/builder', (req, res) => {
    const hosts = [...new Set([].concat(req.body?.allowHosts || []).map((h) => String(h).trim().toLowerCase()).filter(Boolean))]
    const bad = hosts.find((h) => !/^[a-z0-9.\-[\]:]+$/.test(h) || h.length > 100)
    if (bad) return res.status(400).json({ error: `Host tidak valid: ${bad}` })
    if (hosts.length > 30) return res.status(400).json({ error: 'Maksimal 30 host.' })
    bot.saveSettings({ builder: { ...(bot.settings.builder || {}), allowHosts: hosts } })
    res.json({ ok: true, allowHosts: hosts })
  })

  // ----- integrasi (webhook n8n & API masuk) -----
  const publicIntegrations = () => ({
    webhooks: (bot.settings.webhooks || []).map(({ secret, ...w }) => ({ ...w, secretSet: !!secret })),
    status: integ.webhookStatus(),
    events: integ.EVENTS,
    api: { enabled: !!bot.settings.api?.enabled, tokenSet: !!bot.settings.api?.token, tokenHint: bot.settings.api?.token ? `${bot.settings.api.token.slice(0, 6)}…${bot.settings.api.token.slice(-4)}` : '' }
  })
  app.get('/api/integrations', (req, res) => res.json(publicIntegrations()))
  app.put('/api/integrations/webhooks', (req, res) => {
    const cur = bot.settings.webhooks || []
    const list = [].concat(req.body?.webhooks || [])
    if (list.length > 10) return res.status(400).json({ error: 'Maksimal 10 webhook.' })
    const out = []
    for (const w of list) {
      const url = String(w?.url || '').trim()
      if (!/^https?:\/\/\S+$/i.test(url)) return res.status(400).json({ error: `URL webhook tidak valid: ${url || '(kosong)'}` })
      const events = [].concat(w.events || []).filter((e) => integ.EVENTS.includes(e))
      if (!events.length) return res.status(400).json({ error: 'Pilih minimal satu event untuk tiap webhook.' })
      const old = cur.find((x) => x.id === w.id)
      out.push({
        id: old?.id || w.id || crypto.randomBytes(6).toString('hex'),
        url,
        events,
        enabled: w.enabled !== false,
        reply: !!w.reply,
        timeout: Math.min(30, Math.max(2, Number(w.timeout) || 10)),
        // secret hanya berubah bila dikirim (string kosong = biarkan; null = hapus)
        secret: w.secret === null ? '' : w.secret ? String(w.secret).slice(0, 200) : old?.secret || crypto.randomBytes(16).toString('hex')
      })
    }
    bot.saveSettings({ webhooks: out })
    res.json(publicIntegrations())
  })
  app.post('/api/integrations/webhooks/:id/secret', (req, res) => {
    const w = (bot.settings.webhooks || []).find((x) => x.id === req.params.id)
    if (!w) return res.status(404).json({ error: 'Webhook tidak ditemukan' })
    res.json({ secret: w.secret || '' })
  })
  app.post('/api/integrations/webhooks/:id/test', asyncRoute(async (req, res) => {
    const w = (bot.settings.webhooks || []).find((x) => x.id === req.params.id)
    if (!w) return res.status(404).json({ error: 'Webhook tidak ditemukan' })
    const body = JSON.stringify({ event: 'test', bot: { name: bot.settings.botName }, at: Date.now(), data: { text: 'Tes webhook dari dashboard xorizn-bot' } })
    try {
      const r = await fetch(w.url, { method: 'POST', headers: { 'content-type': 'application/json', 'x-xorizn-event': 'test', 'x-xorizn-signature': integ.sign(w.secret, body) }, body, signal: AbortSignal.timeout(10000) })
      res.json({ ok: r.ok, status: r.status, body: (await r.text()).slice(0, 500) })
    } catch (err) {
      res.json({ ok: false, error: err?.cause?.code || err?.message })
    }
  }))
  app.patch('/api/integrations/api', (req, res) => {
    const cur = bot.settings.api || {}
    const next = { enabled: req.body?.enabled ?? cur.enabled ?? false, token: cur.token || '' }
    let token = null
    if (req.body?.regenerate || (next.enabled && !next.token)) {
      next.token = integ.newToken()
      token = next.token
    }
    bot.saveSettings({ api: next })
    // token lengkap hanya ditampilkan sekali, saat dibuat
    res.json({ ...publicIntegrations(), token })
  })

  // ----- commands -----
  app.get('/api/commands', (req, res) => {
    res.json({ commands: commandRows(), counts: bot.registry.counts(), providerOrder: bot.settings.providerOrder })
  })
  app.patch('/api/commands/:name', (req, res) => {
    const name = req.params.name.toLowerCase()
    const entry = bot.registry.resolve(name)
    if (!entry) return res.status(404).json({ error: 'Perintah tidak ditemukan' })
    if (typeof req.body?.disabled === 'boolean') {
      const set = new Set(bot.settings.disabledCommands)
      for (const a of entry.aliases) set.delete(a)
      if (req.body.disabled) set.add(name)
      bot.saveSettings({ disabledCommands: [...set] })
    }
    if (req.body?.provider) {
      const providers = bot.registry.providers(name).map((p) => p.source)
      if (!providers.includes(req.body.provider)) return res.status(400).json({ error: 'Sumber tidak tersedia' })
      bot.saveSettings({ commandProviders: { ...bot.settings.commandProviders, [name]: req.body.provider } })
    }
    res.json({ ok: true })
  })
  app.post('/api/commands/reload', asyncRoute(async (req, res) => {
    const native = await loadNativePlugins(bot.config.paths.plugins)
    bot.registry.register('native', native.entries)
    bot.nativeHooks = native.hooks
    for (const pack of Object.values(bot.packs)) await pack.reload?.()
    res.json({ ok: true, total: bot.registry.active().length })
  }))

  // ----- users -----
  app.get('/api/users', (req, res) => {
    const q = String(req.query.q || '').toLowerCase()
    const filter = String(req.query.filter || '')
    const owners = new Set(bot.settings.owners)
    let list = Object.entries(bot.db.collection('users')).map(([id, u]) => ({
      id,
      number: userPart(id),
      name: u.name,
      premium: isPremium(id),
      premiumTime: u.premiumTime,
      banned: u.banned,
      banReason: u.banReason,
      owner: owners.has(userPart(id)),
      commands: u.commands || 0,
      limit: u.limit,
      lastSeen: u.lastSeen,
      firstSeen: u.firstSeen
    }))
    if (q) list = list.filter((u) => u.number.includes(q) || String(u.name).toLowerCase().includes(q))
    if (filter === 'premium') list = list.filter((u) => u.premium)
    if (filter === 'banned') list = list.filter((u) => u.banned)
    if (filter === 'owner') list = list.filter((u) => u.owner)
    list.sort((a, b) => (b.lastSeen || 0) - (a.lastSeen || 0))
    const page = Math.max(1, Number(req.query.page) || 1)
    const size = 50
    res.json({ total: list.length, page, pages: Math.max(1, Math.ceil(list.length / size)), users: list.slice((page - 1) * size, page * size) })
  })
  app.patch('/api/users/:id', (req, res) => {
    const jid = toPnJid(req.params.id)
    if (!jid) return res.status(400).json({ error: 'id tidak valid' })
    const u = getUser(jid)
    const b = req.body || {}
    if (typeof b.premium === 'boolean') {
      u.premium = b.premium
      u.premiumTime = b.premium && b.days ? Date.now() + Number(b.days) * 86_400_000 : 0
    }
    if (typeof b.banned === 'boolean') {
      u.banned = b.banned
      u.banReason = b.banned ? String(b.banReason || '') : ''
    }
    if (b.limit !== undefined) u.limit = Math.max(0, Number(b.limit) || 0)
    if (typeof b.owner === 'boolean') {
      const set = new Set(bot.settings.owners)
      b.owner ? set.add(userPart(jid)) : set.delete(userPart(jid))
      bot.saveSettings({ owners: [...set] })
    }
    bot.db.save()
    res.json({ ok: true })
  })

  // ----- system config -----
  app.get('/api/config', (req, res) => {
    const c = bot.config
    res.json({
      database: {
        driver: c.database.driver,
        active: bot.db.driverName,
        json: c.database.json,
        sqlite: c.database.sqlite,
        mysql: { ...c.database.mysql, password: c.database.mysql?.password ? '••••••' : '' },
        postgres: { ...(c.database.postgres || {}), password: c.database.postgres?.password ? '••••••' : '', connectionString: maskConnString(c.database.postgres?.connectionString) }
      },
      dashboard: { host: c.dashboard.host, port: c.dashboard.port },
      bot: { loginMethod: c.bot.loginMethod, pairingNumber: c.bot.pairingNumber, sessionDir: c.bot.sessionDir },
      packs: c.packs,
      apiKeys: Object.fromEntries(Object.entries(c.apiKeys || {}).map(([k, v]) => [k, maskKey(v)])),
      drivers: DRIVERS,
      launcher: !!process.env.BOT_LAUNCHER
    })
  })
  app.patch('/api/config', (req, res) => {
    const b = req.body || {}
    const patch = {}
    if (b.dashboard) {
      patch.dashboard = pick(b.dashboard, ['host', 'port', 'password'])
      if (patch.dashboard.password !== undefined && String(patch.dashboard.password).length < 6) return res.status(400).json({ error: 'Password minimal 6 karakter' })
      if (patch.dashboard.port) patch.dashboard.port = Number(patch.dashboard.port)
    }
    if (b.bot) patch.bot = pick(b.bot, ['loginMethod', 'pairingNumber'])
    if (b.packs) patch.packs = pick(b.packs, ['extra', 'classic'])
    if (b.apiKeys) patch.apiKeys = Object.fromEntries(Object.entries(b.apiKeys).filter(([, v]) => typeof v === 'string' && !v.includes('••')))
    saveConfigPatch(patch)
    res.json({ ok: true, restartRequired: true })
  })
  const dbOptions = (driver, body) => {
    const base = bot.config.database[driver] || {}
    const opts = { ...base, ...(body || {}) }
    if (driver === 'mysql' && (!opts.password || String(opts.password).includes('••'))) opts.password = base.password
    if (driver === 'postgres') {
      if (!opts.password || String(opts.password).includes('••')) opts.password = base.password || ''
      // connection string yang disamarkan (password ••) → pakai yang tersimpan
      if (String(opts.connectionString || '').includes('••')) opts.connectionString = base.connectionString || ''
    }
    return opts
  }
  app.post('/api/database/test', asyncRoute(async (req, res) => {
    const { driver, options } = req.body || {}
    if (!DRIVERS.includes(driver)) return res.status(400).json({ error: 'driver tidak valid' })
    const d = await createDriver(driver, dbOptions(driver, options), bot.config.paths.root)
    try {
      await d.connect()
      const rows = await d.load()
      res.json({ ok: true, rows: rows.length, info: d.describe?.() })
    } finally {
      await d.close?.()
    }
  }))
  app.post('/api/database/migrate', asyncRoute(async (req, res) => {
    const { driver, options } = req.body || {}
    if (!DRIVERS.includes(driver)) return res.status(400).json({ error: 'driver tidak valid' })
    const opts = dbOptions(driver, options)
    await bot.db.flush()
    const target = await createDriver(driver, opts, bot.config.paths.root)
    const rows = await bot.db.exportTo(target)
    saveConfigPatch({ database: { driver, [driver]: opts } })
    log.success(`data (${rows} baris) disalin ke ${driver}. Restart untuk memakai driver baru.`)
    res.json({ ok: true, rows, restartRequired: true })
  }))

  // ----- AI / OpenCode -----
  const oc = await import('../features/opencode.js')
  const { routerConfig, routerModels } = await import('../features/transcribe.js')
  const { readMessageMedia, composePrompt } = await import('../features/media-reader.js')
  const OC_KEYS = ['enabled', 'url', 'username', 'password', 'directory', 'defaultModel', 'defaultVariant', 'defaultAgent', 'access', 'permissionMode', 'timeoutSec']
  const ocPublicConfig = () => {
    const c = oc.ocConfig()
    const r = routerConfig()
    return { ...pick(c, OC_KEYS), password: c.password ? '••••••' : '', workspace: oc.workspaceDir(), router: { url: r.url, apiKey: maskKey(r.apiKey), audioModel: r.audioModel } }
  }
  const msgText = (x) => (x.type === 'user' ? x.text : (x.content || []).filter((c) => c.type === 'text').map((c) => c.text).join(''))

  app.get('/api/opencode', asyncRoute(async (req, res) => {
    const status = await oc.status()
    let models = []
    let agents = []
    let sessions = []
    let defaultModel = null
    if (status.ok) {
      ;[models, agents, sessions, defaultModel] = await Promise.all([
        oc.opencode.models().catch(() => []),
        oc.opencode.agents().catch(() => []),
        oc.opencode.sessions(30).catch(() => []),
        oc.opencode.defaultModel().catch(() => null)
      ])
    }
    let router = null
    try {
      const list = await routerModels()
      router = { ok: true, models: list.length, audio: list.filter((m) => m.capabilities?.audioInput).map((m) => m.id) }
    } catch (err) {
      router = { ok: false, error: err.message }
    }
    res.json({
      status,
      config: ocPublicConfig(),
      router,
      defaultModel: defaultModel ? `${defaultModel.providerID}/${defaultModel.id}` : null,
      models: models.filter((m) => !m.type || m.type === 'chat').map((m) => ({ key: `${m.providerID}/${m.id}`, providerID: m.providerID, id: m.id, name: m.name, input: m.capabilities?.input || [], variants: (m.variants || []).map((v) => v.id), enabled: m.enabled !== false, context: m.limit?.context })),
      agents: agents.filter((a) => a.mode !== 'subagent' && !a.hidden).map((a) => ({ id: a.id, description: a.description || a.name })),
      sessions: sessions.map((s) => ({ id: s.id, title: s.title, updated: s.time?.updated, model: s.model ? `${s.model.providerID}/${s.model.id}${s.model.variant && s.model.variant !== 'default' ? `#${s.model.variant}` : ''}` : '', fromBot: s.metadata?.source === 'xorizn-bot', user: s.metadata?.user || '', cost: s.cost, tokens: s.tokens }))
    })
  }))
  app.patch('/api/opencode/config', (req, res) => {
    const b = req.body || {}
    const cur = bot.settings.opencode || {}
    const next = { ...cur, ...pick(b, OC_KEYS) }
    if (typeof next.password === 'string' && next.password.includes('••')) next.password = cur.password || ''
    if (next.timeoutSec !== undefined) next.timeoutSec = Math.min(1800, Math.max(30, Number(next.timeoutSec) || 300))
    if (next.access && !['owner', 'premium', 'all'].includes(next.access)) return res.status(400).json({ error: 'akses tidak valid' })
    if (next.permissionMode && !oc.PERMISSION_PRESETS[next.permissionMode]) return res.status(400).json({ error: 'mode izin tidak valid' })
    if (b.router) {
      const r = { ...(cur.router || {}), ...pick(b.router, ['url', 'apiKey', 'audioModel']) }
      if (typeof r.apiKey === 'string' && r.apiKey.includes('••')) r.apiKey = cur.router?.apiKey || ''
      next.router = r
    }
    bot.saveSettings({ opencode: next })
    res.json({ ok: true, config: ocPublicConfig() })
  })
  app.post('/api/opencode/start', asyncRoute(async (req, res) => {
    const out = await oc.startService()
    log.info('opencode service start:', out.split('\n').pop())
    res.json({ ok: true, output: out, status: await oc.status() })
  }))
  app.get('/api/opencode/sessions/:id/messages', asyncRoute(async (req, res) => {
    const list = await oc.opencode.messages(req.params.id, 60)
    res.json({ messages: list.filter((x) => x.type === 'user' || x.type === 'assistant').reverse().map((x) => ({ id: x.id, role: x.type, text: msgText(x), files: (x.files || []).map((f) => f.name), time: x.time?.created, error: x.error?.message })) })
  }))
  app.delete('/api/opencode/sessions/:id', asyncRoute(async (req, res) => {
    await oc.opencode.deleteSession(req.params.id)
    res.json({ ok: true })
  }))
  app.post('/api/opencode/chat', asyncRoute(async (req, res) => {
    const { text = '', files = [], model, variant, sessionId, newSession } = req.body || {}
    const who = { sender: 'dashboard@s.whatsapp.net', pushName: 'Dashboard', isOwner: true, isPremium: true }
    const state = oc.userState(who.sender)
    if (model) {
      const p = oc.parseModel(model)
      if (p) state.model = { providerID: p.providerID, id: p.id }
    }
    if (variant !== undefined) state.variant = variant || ''
    if (sessionId) state.sessionId = sessionId
    if (newSession) state.sessionId = ''
    bot.db.save()
    // lampiran dari browser → pakai pembaca media yang sama dengan WhatsApp
    const media = { files: [], texts: [], notes: [] }
    for (const f of [].concat(files).slice(0, 5)) {
      const buffer = Buffer.from(String(f.data || ''), 'base64')
      const mime = String(f.mime || 'application/octet-stream')
      const type = mime.startsWith('image/') ? 'imageMessage' : mime.startsWith('audio/') ? 'audioMessage' : mime.startsWith('video/') ? 'videoMessage' : 'documentMessage'
      const fake = { type, msg: { mimetype: mime, fileName: f.name, seconds: 30 }, download: async () => buffer, quoted: null }
      const r = await readMessageMedia(fake)
      media.files.push(...r.files)
      media.texts.push(...r.texts)
      media.notes.push(...r.notes)
    }
    const session = await oc.ensureSession(who)
    const want = await oc.effectiveModel(state)
    if (want && (oc.modelKey(session.model) !== oc.modelKey(want) || (session.model?.variant || '') !== (want.variant || ''))) await oc.opencode.switchModel(session.id, want).catch(() => {})
    const result = await oc.runPrompt(session.id, { text: composePrompt(text, media), files: media.files }, {
      onRetry: async (retry) => {
        if (retry.attempt >= 2 || /rate|quota/i.test(retry.error?.type || '')) await oc.opencode.interrupt(session.id).catch(() => {})
      }
    })
    res.json({ sessionId: session.id, text: result.text, error: result.error ? oc.friendlyError(result.error) : null, ms: result.ms, tokens: result.tokens, model: result.model, tools: result.tools, notes: media.notes })
  }))

  // ----- static SPA -----
  if (!fs.existsSync(path.join(PUBLIC, 'index.html'))) {
    log.warn('dashboard belum di-build (dashboard/out kosong). Jalankan: npm run build:dashboard')
    app.get(/^\/(?!api\/).*/, (req, res) =>
      res.status(503).type('html').send('<h2 style="font-family:sans-serif">Dashboard belum di-build</h2><p style="font-family:sans-serif">Jalankan <code>npm run build:dashboard</code> lalu muat ulang halaman ini.</p>')
    )
  } else {
    // Next 16 (output: 'export') menyimpan prefetch segmen sebagai folder
    // (settings/__next.!KGFkbWluKQ/settings/__PAGE__.txt), sedangkan browser memintanya dengan titik
    // (settings/__next.!KGFkbWluKQ.settings.__PAGE__.txt). Tanpa ini tiap navigasi 404 → muat ulang penuh.
    app.use((req, res, next) => {
      const m = /^(.*\/)__next\.(.+)\.txt$/.exec(req.path)
      if (m && m[2].includes('.')) req.url = `${m[1]}__next.${m[2].split('.').join('/')}.txt`
      next()
    })
    app.use('/_next', express.static(path.join(PUBLIC, '_next'), { maxAge: '365d', immutable: true }))
    app.use(express.static(PUBLIC, { index: 'index.html', maxAge: 0, extensions: ['html'] }))
    app.get(/^\/(?!api\/).*/, (req, res) => res.status(404).sendFile(path.join(PUBLIC, '404.html')))
  }

  app.use((err, req, res, next) => {
    log.error(`${req.method} ${req.path}:`, err.message)
    if (res.headersSent) return next(err)
    res.status(500).json({ error: err.message || 'Kesalahan server' })
  })

  await new Promise((resolve, reject) => {
    const server = app.listen(port, host, resolve)
    server.on('error', reject)
  }).catch((err) => {
    log.error(`dashboard gagal jalan di ${host}:${port}: ${err.message}`)
    throw err
  })
  log.success(`dashboard: http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`)
  if (host !== '127.0.0.1' && host !== 'localhost') log.warn('Dashboard bisa diakses dari jaringan lain. Pastikan password kuat.')
  return app
}
