// lib/autoorder.js — client API AutoOrder v2 (https://auto-order.alxzyy.my.id/docs): akun, saldo, deposit QRIS.
// Konfigurasi di settings.js -> global.autoorder. API key hanya dikirim ke baseUrl itu sebagai header X-API-Key.
'use strict'
const axios = require('axios')
const sharp = require('sharp')
const qr = require('./qr')

const cfg = () => global.autoorder || {}
const enabled = () => !!String(cfg().apiKey || '').trim()
const baseUrl = () => String(cfg().baseUrl || 'https://auto-order.alxzyy.my.id/api/v2').replace(/\/+$/, '')

// Error terstruktur: status HTTP, code dari API (mis. DEPOSIT_NOT_FOUND), retryAfter (detik) untuk 429
class AOError extends Error {
  constructor(message, { status = 0, code = '', retryAfter = 0 } = {}) {
    super(message)
    this.name = 'AOError'
    this.status = status
    this.code = code
    this.retryAfter = retryAfter
  }
}

async function call(method, path, { data, params, timeout = 20000, headers, key } = {}) {
  if (!enabled()) throw new AOError('API key AutoOrder belum diisi di settings.js (global.autoorder.apiKey).', { code: 'NO_KEY' })
  try {
    const res = await axios({
      method,
      url: baseUrl() + path,
      data,
      params,
      timeout,
      headers: { 'X-API-Key': String(key || cfg().apiKey).trim(), 'Content-Type': 'application/json', Accept: 'application/json', ...(headers || {}) },
      validateStatus: () => true
    })
    const body = res.data && typeof res.data === 'object' ? res.data : {}
    if (res.status >= 200 && res.status < 300 && body.success !== false) return body.data !== undefined ? body.data : body
    const retryAfter = Number(body.retry_after ?? body.retryAfter ?? res.headers?.['retry-after']) || 0
    const msg = body.message || body.error || (typeof res.data === 'string' ? res.data.slice(0, 120) : '') || `HTTP ${res.status}`
    throw new AOError(String(msg), { status: res.status, code: String(body.code || ''), retryAfter })
  } catch (err) {
    if (err instanceof AOError) throw err
    throw new AOError(`Tidak bisa terhubung ke AutoOrder (${err.code || err.message})`, { code: 'NETWORK' })
  }
}

const account = () => call('get', '/account')
const balance = () => call('get', '/account/balance')
const createDeposit = (amount, referenceId) => call('post', '/deposit', { data: { amount: Math.round(amount), ...(referenceId ? { reference_id: String(referenceId).slice(0, 100) } : {}) } })
const getDeposit = (id) => call('get', `/deposit/${encodeURIComponent(id)}`)
const cancelDeposit = (id) => call('post', `/deposit/${encodeURIComponent(id)}/cancel`)

// QR PNG dari string QRIS (render lokal, tanpa layanan luar)
async function qrPng(text, size = 720) {
  const q = qr.encode(text)
  const n = q.size
  const unit = Math.max(4, Math.floor(size / (n + 8)))
  const pad = unit * 4
  const W = n * unit + pad * 2
  let rects = ''
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (q.modules[y][x]) rects += `<rect x="${pad + x * unit}" y="${pad + y * unit}" width="${unit + 0.5}" height="${unit + 0.5}"/>`
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}"><rect width="${W}" height="${W}" fill="#fff"/><g fill="#000">${rects}</g></svg>`)
  return sharp(svg).resize(size, size, { kernel: 'nearest', fit: 'contain', background: '#fff' }).png().toBuffer()
}

// ---------- Nokos OTP ----------
const nokosServices = () => call('get', '/nokos/services')
// daftar penawaran (array): id, tier, tierLabel, countryName, countryCode, available, price, note
const nokosOffers = (productId, { tier, country } = {}) => {
  const params = {}
  if (tier) params.tier = tier
  if (country) params.country = country
  return call('get', `/nokos/offers/${encodeURIComponent(productId)}`, { params })
}
const nokosOrder = (data) => call('post', '/nokos/order', { data })
const nokosGet = (orderId) => call('get', `/nokos/order/${encodeURIComponent(orderId)}`)
const nokosCancel = (orderId) => call('post', `/nokos/order/${encodeURIComponent(orderId)}/cancel`)

// ---------- Order universal ----------
const universalOrder = (data) => call('post', '/order', { data })

// ---------- Storage ----------
const storageKey = () => String(cfg().storageKey || cfg().apiKey || '').trim()

// multipart/form-data dibuat manual (tanpa paket tambahan)
function multipart(fields, file) {
  const boundary = '----xorizn-bot' + require('crypto').randomBytes(12).toString('hex')
  const parts = []
  for (const [k, v] of Object.entries(fields)) parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${k}"\r\n\r\n${v}\r\n`))
  const fname = String(file.filename || 'file').replace(/["\r\n]/g, '_')
  parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${file.field}"; filename="${fname}"\r\nContent-Type: ${file.mime || 'application/octet-stream'}\r\n\r\n`))
  parts.push(file.buffer, Buffer.from(`\r\n--${boundary}--\r\n`))
  return { body: Buffer.concat(parts), type: `multipart/form-data; boundary=${boundary}` }
}
const postForm = (path, fields, file) => {
  const f = multipart(fields, file)
  return call('post', path, { data: f.body, key: storageKey(), headers: { 'Content-Type': f.type, 'x-api-key': storageKey() }, timeout: 120000 })
}

const CHUNK = 4 * 1024 * 1024
// Upload file; di atas 8 MB otomatis dipecah per 4 MB lewat /storage/upload-chunk
async function storageUpload(buffer, { filename = 'file', mime, isPublic = true } = {}) {
  if (buffer.length <= 2 * CHUNK) return postForm('/storage/upload', { isPublic: String(!!isPublic) }, { field: 'file', filename, mime, buffer })
  const uploadId = require('crypto').randomBytes(8).toString('hex')
  const total = Math.ceil(buffer.length / CHUNK)
  let res
  for (let i = 0; i < total; i++) {
    res = await postForm('/storage/upload-chunk', { uploadId, chunkIndex: i, totalChunks: total, fileName: filename, isPublic: String(!!isPublic) }, { field: 'chunk', filename, mime, buffer: buffer.subarray(i * CHUNK, (i + 1) * CHUNK) })
  }
  if (!res || !res.completed) throw new AOError('Upload chunk belum selesai di sisi server.', { code: 'CHUNK_INCOMPLETE' })
  return res
}
// isi file .json / .txt yang tersimpan
const storageContent = (id) => call('get', `/storage/files/${encodeURIComponent(id)}/content`, { key: storageKey(), headers: { 'x-api-key': storageKey() } })
// link streaming (tanpa /api/v2); file privat butuh ?key=
const storageLink = (id, { download = false, key = false } = {}) => {
  const root = baseUrl().replace(/\/api\/v\d+$/, '')
  const q = [download && 'download=1', key && `key=${encodeURIComponent(storageKey())}`].filter(Boolean).join('&')
  return `${root}/storage/s/${encodeURIComponent(id)}${q ? '?' + q : ''}`
}

module.exports = { cfg, enabled, AOError, account, balance, createDeposit, getDeposit, cancelDeposit, qrPng, nokosServices, nokosOffers, nokosOrder, nokosGet, nokosCancel, universalOrder, storageUpload, storageContent, storageLink }
