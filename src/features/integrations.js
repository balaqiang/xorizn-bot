/**
 * Integrasi n8n / aplikasi lain.
 *
 *  Webhook keluar (settings.webhooks): event "message", "command", "group" dikirim sebagai POST JSON.
 *    Header: X-Xorizn-Event, X-Xorizn-Signature: sha256=<HMAC body dengan secret webhook>
 *    Bila webhook.reply aktif dan respons berisi JSON { reply: "teks" } (atau { text }), bot membalas ke chat asal.
 *  API masuk (settings.api): POST /api/v1/send, GET /api/v1/status, GET /api/v1/groups
 *    Header: Authorization: Bearer <token>
 *
 * Semua kegagalan hanya dicatat di log — tidak pernah menghentikan bot.
 */
import crypto from 'node:crypto'
import bot from '../core/bot.js'
import logger from '../core/logger.js'

const log = logger.child('webhook')
export const EVENTS = ['message', 'command', 'group']
const status = new Map() // id → { at, ok, code, error }
const warned = new Map()

export const webhooks = () => (bot.settings?.webhooks || []).filter((w) => w && w.enabled !== false && w.url)
export const webhookStatus = () => Object.fromEntries(status)

function warnOnce(id, msg) {
  const last = warned.get(id) || 0
  if (Date.now() - last > 60_000) {
    warned.set(id, Date.now())
    log.warn(msg)
  }
}

export const sign = (secret, body) => `sha256=${crypto.createHmac('sha256', String(secret || '')).update(body).digest('hex')}`

/** Kirim event ke semua webhook yang berlangganan. Tidak pernah melempar. */
export function emit(event, data, { chat = event === 'group' ? data?.group : data?.chat } = {}) {
  const hooks = webhooks().filter((w) => (w.events || ['message']).includes(event))
  if (!hooks.length) return
  const body = JSON.stringify({ event, bot: { name: bot.settings?.botName, number: String(bot.sock?.user?.id || '').split(':')[0].split('@')[0] }, at: Date.now(), data })
  for (const w of hooks) {
    ;(async () => {
      try {
        const res = await fetch(w.url, {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'user-agent': 'xorizn-bot/1.0', 'x-xorizn-event': event, 'x-xorizn-signature': sign(w.secret, body) },
          body,
          signal: AbortSignal.timeout(Math.min(30, Math.max(2, Number(w.timeout) || 10)) * 1000)
        })
        status.set(w.id, { at: Date.now(), ok: res.ok, code: res.status })
        if (!res.ok) return warnOnce(w.id, `webhook ${w.url} membalas HTTP ${res.status}`)
        if (w.reply && chat && bot.sock) {
          const text = await res.text()
          let json = null
          try {
            json = JSON.parse(text)
          } catch {}
          const reply = typeof json?.reply === 'string' ? json.reply : typeof json?.text === 'string' ? json.text : null
          if (reply && reply.trim()) await bot.sock.sendMessage(chat, { text: reply.slice(0, 4000) })
        }
      } catch (err) {
        status.set(w.id, { at: Date.now(), ok: false, error: err?.name === 'TimeoutError' ? 'timeout' : err?.cause?.code || err?.message })
        warnOnce(w.id, `webhook ${w.url} gagal: ${err?.cause?.code || err?.message}`)
      }
    })()
  }
}

/** Data pesan yang dikirim ke webhook. */
export const messagePayload = (m, extra = {}) => ({
  id: m.id,
  chat: m.chat,
  isGroup: m.isGroup,
  sender: m.sender,
  senderName: m.pushName || '',
  type: String(m.type || '').replace(/Message$/, ''),
  text: m.text || '',
  quotedText: m.quoted?.text || '',
  timestamp: m.timestamp,
  ...extra
})

// ---------- API masuk ----------
const hits = new Map()
export function checkToken(req) {
  const api = bot.settings?.api || {}
  if (!api.enabled || !api.token) return { ok: false, code: 403, error: 'API belum diaktifkan di dashboard.' }
  const got = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  const a = Buffer.from(got)
  const b = Buffer.from(String(api.token))
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return { ok: false, code: 401, error: 'Token API salah.' }
  const now = Date.now()
  const list = (hits.get('t') || []).filter((t) => now - t < 60_000)
  if (list.length >= 60) return { ok: false, code: 429, error: 'Terlalu banyak permintaan (maks 60/menit).' }
  list.push(now)
  hits.set('t', list)
  return { ok: true }
}

/** "628123..." / "0812..." / jid → jid tujuan. */
export function toJid(to) {
  const s = String(to || '').trim()
  if (/@(s\.whatsapp\.net|g\.us|lid|newsletter)$/.test(s)) return s
  let d = s.replace(/\D/g, '')
  if (d.startsWith('0')) d = `62${d.slice(1)}`
  if (d.length < 8 || d.length > 16) return null
  return `${d}@s.whatsapp.net`
}

/** Bangun konten Baileys dari body API. */
export function contentFromBody(b) {
  const caption = b.caption ?? b.text ?? ''
  if (b.image) return { image: { url: String(b.image) }, caption }
  if (b.video) return { video: { url: String(b.video) }, caption }
  if (b.audio) return { audio: { url: String(b.audio) }, mimetype: b.mimetype || 'audio/mpeg', ptt: !!b.ptt }
  if (b.document) return { document: { url: String(b.document) }, mimetype: b.mimetype || 'application/octet-stream', fileName: String(b.fileName || 'file'), caption }
  if (b.sticker) return { sticker: { url: String(b.sticker) } }
  if (typeof b.text === 'string' && b.text.trim()) return { text: b.text.slice(0, 65000) }
  return null
}

export const newToken = () => `xb_${crypto.randomBytes(24).toString('base64url')}`
