/**
 * Validasi & eksekusi perintah kustom (rangkaian langkah, tanpa eval).
 *
 * Langkah:
 *   http   { method, url, headers, query, body, bodyType: json|form|text, responseType: auto|json|text, timeout, save, failText }
 *   pick   { path, save, required, failText }          ambil data: res.result.images.random
 *   set    { save, value }                             simpan teks / nilai
 *   random { items: [...], save } | { path, itemPath?, save }   pilih satu dari daftar
 *   check  { path, op, value, failText }               hentikan dengan pesan bila syarat tidak terpenuhi
 *   reply  { kind: text|any|image|video|audio|voice|sticker|document, text, url, fileName }
 *   react  { emoji }
 *   ai     { prompt, save }                            tanya AI (pengaturan AI di dashboard)
 *   delay  { seconds }
 *   stop   { text }                                    balas (opsional) lalu selesai
 */
import sharp from 'sharp'
import { fileTypeFromBuffer } from 'file-type'
import { render, renderDeep, evalExpr, getPath, splitPath, checkTemplate, toText, TemplateError } from './path.js'
import { safeRequest, parseBody, NetError } from './net.js'
import { secretScope } from './secrets.js'
import { createRedactor, responseSample } from './preview.js'
import { toSticker } from '../sticker.js'
import { toVoiceNote } from '../media.js'

export const LIMITS = { steps: 25, http: 5, replies: 5, runtimeMs: 90000, mediaBytes: 25 * 1048576, textLen: 4000 }
export const STEP_TYPES = ['http', 'pick', 'set', 'random', 'check', 'reply', 'react', 'ai', 'delay', 'stop']
export const REPLY_KINDS = ['text', 'any', 'image', 'video', 'audio', 'voice', 'sticker', 'document']
export const CHECK_OPS = ['exists', 'empty', 'equals', 'notEquals', 'contains', 'gt', 'lt', 'matches']
const RESERVED = new Set(['text', 'args', 'command', 'prefix', 'sender', 'chat', 'quoted', 'bot', 'date', 'time', 'secret', 'vars', ...Array.from({ length: 9 }, (_, i) => `arg${i + 1}`)])
export const NAME_RE = /^[a-z0-9][a-z0-9_-]{0,29}$/
const VAR_RE = /^[a-z_][a-z0-9_]{0,30}$/i

export class StepError extends Error {
  constructor(message, step) {
    super(message)
    this.step = step
    this.userFacing = true
  }
}

// ---------- validasi ----------
function str(v, field, i, { required = false, max = LIMITS.textLen } = {}) {
  if (v === undefined || v === null || v === '') {
    if (required) throw new StepError(`Langkah ${i + 1}: "${field}" wajib diisi.`, i)
    return
  }
  if (typeof v !== 'string') throw new StepError(`Langkah ${i + 1}: "${field}" harus teks.`, i)
  if (v.length > max) throw new StepError(`Langkah ${i + 1}: "${field}" terlalu panjang (maks ${max}).`, i)
  try {
    checkTemplate(v)
  } catch (e) {
    throw new StepError(`Langkah ${i + 1} (${field}): ${e.message}`, i)
  }
}
function varName(v, i, required = true) {
  if (!v && !required) return
  if (!VAR_RE.test(String(v || ''))) throw new StepError(`Langkah ${i + 1}: nama variabel "${v || ''}" tidak valid (huruf/angka/_).`, i)
  if (RESERVED.has(String(v).toLowerCase())) throw new StepError(`Langkah ${i + 1}: "${v}" adalah nama bawaan, pakai nama lain.`, i)
}
function deepStrings(obj, field, i, depth = 0) {
  if (depth > 6) throw new StepError(`Langkah ${i + 1}: ${field} terlalu dalam.`, i)
  if (typeof obj === 'string') return str(obj, field, i)
  if (Array.isArray(obj)) return obj.forEach((x) => deepStrings(x, field, i, depth + 1))
  if (obj && typeof obj === 'object') for (const v of Object.values(obj)) deepStrings(v, field, i, depth + 1)
}

function literalPath(value, field, i) {
  str(value, field, i, { required: true, max: 300 })
  const path = value.trim()
  if (!/^[\w$-]+(?:\.[\w$-]+|\[-?\d+\])*$/.test(path)) throw new StepError(`Langkah ${i + 1}: "${field}" harus berupa path kolom, mis. res.data.items atau url.`, i)
  try {
    splitPath(path)
  } catch (err) {
    throw new StepError(`Langkah ${i + 1}: ${err.message}`, i)
  }
  return path
}

/** Validasi & rapikan definisi. Melempar StepError dengan pesan yang bisa ditampilkan. */
export function validate(def) {
  if (!def || typeof def !== 'object') throw new StepError('Definisi perintah kosong.')
  const name = String(def.name || '').toLowerCase().trim()
  if (!NAME_RE.test(name)) throw new StepError('Nama perintah hanya huruf kecil/angka/-/_ (maks 30), mis. "waifu".')
  const aliases = [...new Set([].concat(def.aliases || []).map((a) => String(a).toLowerCase().trim()).filter(Boolean))].filter((a) => a !== name)
  for (const a of aliases) if (!NAME_RE.test(a)) throw new StepError(`Alias "${a}" tidak valid.`)
  if (aliases.length > 10) throw new StepError('Maksimal 10 alias.')
  const steps = Array.isArray(def.steps) ? def.steps : []
  if (!steps.length) throw new StepError('Tambahkan minimal satu langkah.')
  if (steps.length > LIMITS.steps) throw new StepError(`Maksimal ${LIMITS.steps} langkah.`)
  if (!steps.some((s) => ['reply', 'stop'].includes(s?.type))) throw new StepError('Tambahkan langkah "balas" agar perintah mengirim sesuatu.')
  let http = 0
  const clean = steps.map((s, i) => {
    if (!s || typeof s !== 'object' || !STEP_TYPES.includes(s.type)) throw new StepError(`Langkah ${i + 1}: jenis langkah tidak dikenal.`, i)
    const t = s.type
    if (t === 'http') {
      http++
      str(s.url, 'url', i, { required: true, max: 2000 })
      const literal = s.url.replace(/\{\{[^}]*\}\}/g, '')
      if (literal && !/^https?:\/\//i.test(s.url.trim()) && !/^\{\{/.test(s.url.trim())) throw new StepError(`Langkah ${i + 1}: URL harus diawali http:// atau https://`, i)
      const method = String(s.method || 'GET').toUpperCase()
      if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) throw new StepError(`Langkah ${i + 1}: method tidak valid.`, i)
      deepStrings(s.headers || {}, 'headers', i)
      deepStrings(s.query || {}, 'query', i)
      deepStrings(s.body ?? '', 'body', i)
      varName(s.save || 'res', i)
      str(s.failText, 'failText', i, { max: 500 })
      return {
        type: t, method, url: s.url.trim(), headers: s.headers || {}, query: s.query || {}, body: s.body ?? '',
        bodyType: ['json', 'form', 'text'].includes(s.bodyType) ? s.bodyType : 'json',
        responseType: ['auto', 'json', 'text'].includes(s.responseType) ? s.responseType : 'auto',
        timeout: Math.min(30, Math.max(1, Number(s.timeout) || 15)), save: s.save || 'res', failText: s.failText || ''
      }
    }
    if (t === 'pick') {
      str(s.path, 'path', i, { required: true, max: 300 })
      varName(s.save, i)
      str(s.failText, 'failText', i, { max: 500 })
      return { type: t, path: s.path.trim().replace(/^\{\{\s*|\s*\}\}$/g, ''), save: s.save, required: s.required !== false, failText: s.failText || '' }
    }
    if (t === 'set') {
      varName(s.save, i)
      str(s.value, 'value', i, { required: true })
      return { type: t, save: s.save, value: s.value }
    }
    if (t === 'random') {
      varName(s.save, i)
      if (s.path !== undefined) {
        const path = literalPath(s.path, 'path', i)
        const itemPath = s.itemPath ? literalPath(s.itemPath, 'itemPath', i) : ''
        return { type: t, path, itemPath, save: s.save }
      }
      if (!Array.isArray(s.items) || !s.items.length || s.items.length > 100) throw new StepError(`Langkah ${i + 1}: isi 1-100 pilihan.`, i)
      s.items.forEach((x) => str(String(x), 'items', i))
      return { type: t, items: s.items.map(String), save: s.save }
    }
    if (t === 'check') {
      str(s.path, 'path', i, { required: true, max: 300 })
      if (!CHECK_OPS.includes(s.op)) throw new StepError(`Langkah ${i + 1}: operator cek tidak dikenal.`, i)
      str(s.value === undefined ? undefined : String(s.value), 'value', i, { max: 500 })
      if (s.op === 'matches') {
        try {
          new RegExp(String(s.value || ''))
        } catch {
          throw new StepError(`Langkah ${i + 1}: pola regex tidak valid.`, i)
        }
      }
      str(s.failText, 'failText', i, { max: 500 })
      return { type: t, path: s.path.trim().replace(/^\{\{\s*|\s*\}\}$/g, ''), op: s.op, value: s.value === undefined ? '' : String(s.value), failText: s.failText || '' }
    }
    if (t === 'reply') {
      const kind = REPLY_KINDS.includes(s.kind) ? s.kind : 'text'
      str(s.text, 'text', i, { required: kind === 'text' })
      if (kind !== 'text') str(s.url, 'url', i, { required: true, max: 2000 })
      str(s.fileName, 'fileName', i, { max: 120 })
      return { type: t, kind, text: s.text || '', url: (s.url || '').trim(), fileName: s.fileName || '' }
    }
    if (t === 'react') {
      if (!s.emoji || String(s.emoji).length > 8) throw new StepError(`Langkah ${i + 1}: isi satu emoji.`, i)
      return { type: t, emoji: String(s.emoji) }
    }
    if (t === 'ai') {
      str(s.prompt, 'prompt', i, { required: true })
      varName(s.save || 'ai', i)
      return { type: t, prompt: s.prompt, save: s.save || 'ai' }
    }
    if (t === 'delay') return { type: t, seconds: Math.min(10, Math.max(0.1, Number(s.seconds) || 1)) }
    if (t === 'stop') {
      str(s.text, 'text', i)
      return { type: t, text: s.text || '' }
    }
    return s
  })
  if (http > LIMITS.http) throw new StepError(`Maksimal ${LIMITS.http} langkah HTTP.`)
  const f = def.flags || {}
  return {
    name,
    aliases,
    description: String(def.description || '').slice(0, 200),
    usage: String(def.usage || '').slice(0, 60),
    category: String(def.category || 'custom').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 20) || 'custom',
    enabled: def.enabled !== false,
    cooldown: Math.min(300, Math.max(0, Number(def.cooldown) || 0)),
    flags: { group: !!f.group, private: !!f.private, admin: !!f.admin, owner: !!f.owner, premium: !!f.premium, limit: Math.min(100, Math.max(0, Number(f.limit) || 0)) },
    steps: clean
  }
}

// ---------- eksekusi ----------
function baseScope(m, ctx) {
  const args = ctx.args || []
  const now = new Date()
  const tz = ctx.settings?.timezone || 'Asia/Jakarta'
  const scope = {
    text: ctx.text || '',
    args,
    command: ctx.command || '',
    prefix: ctx.prefix || '',
    sender: { name: m.pushName || '', number: String(m.sender || '').split('@')[0], jid: m.sender || '' },
    chat: { id: m.chat || '', isGroup: !!m.isGroup, name: ctx.groupMetadata?.subject || '' },
    quoted: { text: m.quoted?.text || '' },
    bot: { name: ctx.settings?.botName || '' },
    date: now.toLocaleDateString('id-ID', { timeZone: tz, dateStyle: 'long' }),
    time: now.toLocaleTimeString('id-ID', { timeZone: tz, timeStyle: 'short' })
  }
  args.slice(0, 9).forEach((a, i) => (scope[`arg${i + 1}`] = a))
  return scope
}

const isEmpty = (v) => v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length) || (typeof v === 'object' && !Array.isArray(v) && !Object.keys(v).length)

function checkOp(v, op, want) {
  switch (op) {
    case 'exists':
      return !isEmpty(v)
    case 'empty':
      return isEmpty(v)
    case 'equals':
      return toText(v) === want
    case 'notEquals':
      return toText(v) !== want
    case 'contains':
      return toText(v).toLowerCase().includes(String(want).toLowerCase())
    case 'gt':
      return Number(v) > Number(want)
    case 'lt':
      return Number(v) < Number(want)
    case 'matches':
      return new RegExp(want, 'i').test(toText(v))
  }
  return false
}

async function readMedia(source, i) {
  if (Buffer.isBuffer(source)) {
    if (!source.length) throw new StepError(`Langkah ${i + 1}: media kosong.`, i)
    return { buffer: source, contentType: '' }
  }
  if (typeof source !== 'string' || !/^https?:\/\//i.test(source)) throw new StepError(`Langkah ${i + 1}: URL media tidak valid.`, i)
  const res = await safeRequest(source, { maxBytes: LIMITS.mediaBytes, timeoutMs: 30000 })
  if (res.status >= 400) throw new StepError(`Langkah ${i + 1}: media tidak bisa diambil (HTTP ${res.status}).`, i)
  if (!res.buffer.length) throw new StepError(`Langkah ${i + 1}: media kosong.`, i)
  return res
}

// Format lain tetap dapat dikirim sebagai lampiran, termasuk berkas tanpa penanda format.
function automaticKind(mime) {
  if (['image/jpeg', 'image/png', 'image/webp'].includes(mime)) return 'image'
  if (['video/mp4', 'video/3gpp'].includes(mime)) return 'video'
  if (['audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/opus', 'audio/aac', 'audio/amr'].includes(mime)) return 'audio'
  return 'document'
}

/**
 * Jalankan definisi (sudah divalidasi).
 *  opts.dryRun: true → tidak mengirim ke WhatsApp, hanya mengumpulkan hasil (untuk tombol "Coba" di dashboard).
 *  → { ok, replies, trace, error, errorStep }
 */
export async function run(def, m, ctx, { dryRun = false } = {}) {
  const started = Date.now()
  const scope = baseScope(m, ctx)
  const replies = []
  const trace = []
  const { remember, rememberCredentials, mask } = createRedactor()
  let httpCalls = 0
  const send = async (content, summary) => {
    if (replies.length >= LIMITS.replies) throw new StepError(`Maksimal ${LIMITS.replies} balasan per perintah.`)
    replies.push(summary)
    if (!dryRun) await m.reply(content)
  }
  const tpl = (s, opts = {}) => render(s, scope, opts)

  try {
    for (const [i, step] of def.steps.entries()) {
      if (Date.now() - started > LIMITS.runtimeMs) throw new StepError('Perintah berjalan terlalu lama (lebih dari 90 detik).', i)
      const t0 = Date.now()
      let info = ''
      let preview
      switch (step.type) {
        case 'http': {
          if (++httpCalls > LIMITS.http) throw new StepError(`Maksimal ${LIMITS.http} panggilan HTTP.`, i)
          const hs = { ...scope, secret: secretScope(remember) }
          const url = new URL(render(step.url, hs, { allowSecrets: true }))
          for (const [k, v] of Object.entries(renderDeep(step.query, hs, { allowSecrets: true }))) if (v !== '' && v !== undefined) url.searchParams.set(k, toText(v))
          const headers = Object.fromEntries(Object.entries(renderDeep(step.headers, hs, { allowSecrets: true })).map(([k, v]) => [k.toLowerCase(), toText(v)]))
          rememberCredentials(url.searchParams)
          rememberCredentials(Object.entries(headers))
          let body
          if (step.method !== 'GET' && step.method !== 'DELETE' && step.body !== '' && step.body !== undefined) {
            const b = renderDeep(step.body, hs, { allowSecrets: true })
            if (step.bodyType === 'form') {
              body = new URLSearchParams(typeof b === 'object' ? Object.fromEntries(Object.entries(b).map(([k, v]) => [k, toText(v)])) : String(b)).toString()
              headers['content-type'] ||= 'application/x-www-form-urlencoded'
            } else if (step.bodyType === 'text') {
              body = toText(b)
              headers['content-type'] ||= 'text/plain; charset=utf-8'
            } else {
              body = typeof b === 'string' ? b : JSON.stringify(b)
              headers['content-type'] ||= 'application/json'
            }
          }
          const res = await safeRequest(url.toString(), { method: step.method, headers, body, timeoutMs: step.timeout * 1000 })
          if (res.status >= 400) throw new StepError(step.failText ? tpl(step.failText) : `API membalas HTTP ${res.status}.`, i)
          scope[step.save] = parseBody(res, step.responseType)
          scope[`${step.save}_status`] = res.status
          if (dryRun && !Buffer.isBuffer(scope[step.save])) preview = responseSample(scope[step.save], mask)
          info = `${step.method} ${url.hostname} → ${res.status} (${res.buffer.length} B)`
          break
        }
        case 'pick': {
          const v = evalExpr(step.path, scope)
          if (step.required && isEmpty(v)) throw new StepError(step.failText ? tpl(step.failText) : 'Data tidak ditemukan.', i)
          scope[step.save] = v
          info = `${step.save} = ${mask(toText(v)).slice(0, 80)}`
          break
        }
        case 'set': {
          scope[step.save] = tpl(step.value, { raw: true })
          info = `${step.save} = ${mask(toText(scope[step.save])).slice(0, 80)}`
          break
        }
        case 'random': {
          if (step.path) {
            const items = getPath(scope, step.path, { literal: true })
            if (!Array.isArray(items)) throw new StepError(`Kolom "${step.path}" harus berupa daftar JSON.`, i)
            if (!items.length) throw new StepError(`Daftar "${step.path}" kosong.`, i)
            const item = items[Math.floor(Math.random() * items.length)]
            const selected = step.itemPath ? getPath(item, step.itemPath, { literal: true, allowSecrets: true }) : item
            if (selected === undefined || selected === null) throw new StepError('Item terpilih tidak memiliki nilai pada kolom yang diminta.', i)
            scope[step.save] = selected
          } else {
            const item = step.items[Math.floor(Math.random() * step.items.length)]
            scope[step.save] = tpl(item)
          }
          info = `${step.save} = ${mask(toText(scope[step.save])).slice(0, 80)}`
          break
        }
        case 'check': {
          const v = evalExpr(step.path, scope)
          const ok = checkOp(v, step.op, tpl(step.value))
          info = `${step.path} ${step.op} → ${ok ? 'lolos' : 'berhenti'}`
          if (!ok) {
            const text = mask(tpl(step.failText || '')) || 'Syarat tidak terpenuhi.'
            await send({ text }, { kind: 'text', text })
            trace.push({ step: i + 1, type: step.type, ms: Date.now() - t0, ok: true, info: mask(info) })
            return { ok: true, replies, trace, stopped: true }
          }
          break
        }
        case 'reply': {
          const caption = mask(tpl(step.text || '')).slice(0, LIMITS.textLen)
          if (step.kind === 'text') {
            if (!caption.trim()) throw new StepError('Teks balasan kosong.', i)
            await send({ text: caption }, { kind: 'text', text: caption })
            info = caption.slice(0, 80)
            break
          }
          const source = tpl(step.url, { raw: step.kind === 'any' })
          const media = await readMedia(source, i)
          const detected = step.kind === 'any' ? await fileTypeFromBuffer(media.buffer).catch(() => undefined) : undefined
          const kind = step.kind === 'any' ? automaticKind(detected?.mime) : step.kind
          const ct = detected?.mime || media.contentType.split(';')[0] || 'application/octet-stream'
          let content
          let previewImage
          if (kind === 'image' || kind === 'sticker') {
            const meta = await sharp(media.buffer, { animated: true }).metadata().catch(() => null)
            const isVideo = /video|gif/.test(ct)
            if (!meta && !(kind === 'sticker' && isVideo)) throw new StepError(`Langkah ${i + 1}: URL bukan gambar (${ct || 'tipe tidak diketahui'}).`, i)
            content = kind === 'image' ? { image: media.buffer, caption, ...(detected && { mimetype: ct }) } : dryRun ? { sticker: true } : { sticker: await toSticker(media.buffer, { mimetype: isVideo ? ct : 'image/png' }) }
            if (dryRun && kind === 'image') {
              const thumbnail = await sharp(media.buffer).rotate().resize({ width: 192, height: 192, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 75 }).toBuffer()
              previewImage = 'data:image/jpeg;base64,' + thumbnail.toString('base64')
            }
          } else if (kind === 'video') content = { video: media.buffer, caption, mimetype: /video/.test(ct) ? ct : 'video/mp4' }
          else if (kind === 'audio') content = { audio: media.buffer, mimetype: /audio/.test(ct) ? ct : 'audio/mpeg' }
          else if (kind === 'voice') content = dryRun ? { audio: true } : { audio: await toVoiceNote(media.buffer, ct), mimetype: 'audio/ogg; codecs=opus', ptt: true }
          else content = { document: media.buffer, mimetype: ct, fileName: mask(tpl(step.fileName || '')) || (detected ? `file.${detected.ext}` : 'file'), caption }
          await send(content, { kind, ...(typeof source === 'string' && { url: mask(source) }), contentType: mask(ct), bytes: media.buffer.length, text: caption, ...(previewImage && { previewImage }) })
          info = `${kind} ${ct} ${media.buffer.length} B`
          break
        }
        case 'react': {
          if (!dryRun) await m.react(step.emoji)
          info = step.emoji
          break
        }
        case 'ai': {
          const { aiReady, chat } = await import('../aichat.js')
          if (!aiReady()) throw new StepError('AI belum dikonfigurasi. Isi pengaturan AI di dashboard.', i)
          const prompt = tpl(step.prompt)
          const res = await chat({ chat: `custom:${m.chat}`, sender: `${def.name}:${Date.now()}` }, prompt)
          scope[step.save] = res.text
          info = `${res.model}: ${mask(res.text).slice(0, 60)}`
          break
        }
        case 'delay': {
          await new Promise((r) => setTimeout(r, step.seconds * 1000))
          info = `${step.seconds} dtk`
          break
        }
        case 'stop': {
          const text = mask(tpl(step.text || ''))
          if (text.trim()) await send({ text }, { kind: 'text', text })
          trace.push({ step: i + 1, type: step.type, ms: Date.now() - t0, ok: true, info: 'selesai' })
          return { ok: true, replies, trace, stopped: true }
        }
      }
      trace.push({ step: i + 1, type: step.type, ms: Date.now() - t0, ok: true, info: mask(info), ...preview })
    }
    return { ok: true, replies, trace }
  } catch (err) {
    const step = err.step ?? trace.length
    const message = mask(err instanceof StepError || err instanceof NetError || err instanceof TemplateError ? err.message : `Kesalahan internal: ${err?.message || err}`)
    trace.push({ step: step + 1, type: def.steps[step]?.type || '?', ms: 0, ok: false, info: message })
    return { ok: false, replies, trace, error: message, errorStep: step + 1 }
  }
}
