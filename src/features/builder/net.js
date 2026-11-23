/**
 * HTTP aman untuk perintah kustom (anti-SSRF):
 *  - hanya http/https, maksimal 3 redirect (tiap lompatan dicek ulang)
 *  - IP privat / loopback / link-local / metadata cloud ditolak, termasuk bila domain
 *    di-resolve ke IP privat (dicek saat koneksi dibuka → tahan DNS rebinding)
 *  - host lokal (mis. n8n di localhost:5678) hanya bisa dipakai bila ada di daftar izin owner
 *  - batas waktu & batas ukuran respons
 */
import dns from 'node:dns'
import net from 'node:net'
import { Agent, request } from 'undici'
import bot from '../../core/bot.js'

export class NetError extends Error {}

// ---------- klasifikasi IP ----------
function v4ToInt(ip) {
  return ip.split('.').reduce((a, b) => (a << 8) + Number(b), 0) >>> 0
}
const V4_BLOCKS = [
  ['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10], ['127.0.0.0', 8], ['169.254.0.0', 16], ['172.16.0.0', 12],
  ['192.0.0.0', 24], ['192.0.2.0', 24], ['192.168.0.0', 16], ['198.18.0.0', 15], ['198.51.100.0', 24], ['203.0.113.0', 24],
  ['224.0.0.0', 4], ['240.0.0.0', 4]
].map(([base, bits]) => [v4ToInt(base), bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0])

function privateV4(ip) {
  const n = v4ToInt(ip)
  return V4_BLOCKS.some(([base, mask]) => ((n & mask) >>> 0) === ((base & mask) >>> 0))
}

function expandV6(ip) {
  let s = ip.toLowerCase().split('%')[0]
  if (s.includes('.')) {
    // ::ffff:1.2.3.4 → ubah bagian IPv4 jadi 2 grup hex
    const i = s.lastIndexOf(':')
    const n = v4ToInt(s.slice(i + 1))
    s = `${s.slice(0, i + 1)}${(n >>> 16).toString(16)}:${(n & 0xffff).toString(16)}`
  }
  const [head, tail] = s.split('::')
  const h = head ? head.split(':') : []
  const t = tail !== undefined ? (tail ? tail.split(':') : []) : []
  const fill = tail !== undefined ? Array(8 - h.length - t.length).fill('0') : []
  return [...h, ...fill, ...t].map((x) => parseInt(x || '0', 16))
}

function privateV6(ip) {
  const g = expandV6(ip)
  if (g.length !== 8 || g.some((x) => Number.isNaN(x))) return true
  if (g.every((x) => x === 0)) return true // ::
  if (g.slice(0, 7).every((x) => x === 0) && g[7] === 1) return true // ::1
  if ((g[0] & 0xfe00) === 0xfc00) return true // fc00::/7 unique local
  if ((g[0] & 0xffc0) === 0xfe80) return true // fe80::/10 link-local
  if ((g[0] & 0xff00) === 0xff00) return true // multicast
  if (g[0] === 0x2001 && g[1] === 0x0db8) return true // dokumentasi
  const embeddedV4 = (hi, lo) => `${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`
  if (g.slice(0, 5).every((x) => x === 0) && g[5] === 0xffff) return privateV4(embeddedV4(g[6], g[7])) // ::ffff:a.b.c.d
  if (g[0] === 0x64 && g[1] === 0xff9b) return privateV4(embeddedV4(g[6], g[7])) // NAT64
  return false
}

export function isPrivateIp(ip) {
  const fam = net.isIP(ip)
  if (fam === 4) return privateV4(ip)
  if (fam === 6) return privateV6(ip)
  return true
}

// ---------- daftar izin ----------
export function allowList() {
  return (bot.settings?.builder?.allowHosts || []).map((h) => String(h).trim().toLowerCase()).filter(Boolean)
}
function isAllowed(u) {
  const list = allowList()
  const host = u.hostname.replace(/^\[|\]$/g, '').toLowerCase()
  const port = u.port || (u.protocol === 'https:' ? '443' : '80')
  return list.includes(host) || list.includes(`${host}:${port}`)
}

// ---------- agent penjaga ----------
function guardedLookup(hostname, options, callback) {
  dns.lookup(hostname, { all: true, verbatim: true }, (err, addrs) => {
    if (err) return callback(err)
    const bad = addrs.find((a) => isPrivateIp(a.address))
    if (bad) return callback(new NetError(`Alamat ${hostname} mengarah ke jaringan lokal/privat (${bad.address}) dan diblokir. Tambahkan ke daftar izin host bila memang disengaja.`))
    if (options?.all) return callback(null, addrs)
    callback(null, addrs[0].address, addrs[0].family)
  })
}
const guardedAgent = new Agent({ connect: { lookup: guardedLookup, timeout: 10000 }, headersTimeout: 20000, bodyTimeout: 30000 })
const openAgent = new Agent({ connect: { timeout: 10000 }, headersTimeout: 20000, bodyTimeout: 30000 })

function checkUrl(raw) {
  let u
  try {
    u = new URL(raw)
  } catch {
    throw new NetError('URL tidak valid.')
  }
  if (!['http:', 'https:'].includes(u.protocol)) throw new NetError('Hanya URL http:// atau https:// yang diizinkan.')
  const allowed = isAllowed(u)
  const host = u.hostname.replace(/^\[|\]$/g, '')
  if (!allowed && net.isIP(host) && isPrivateIp(host)) throw new NetError(`Alamat ${host} adalah jaringan lokal/privat dan diblokir. Tambahkan ke daftar izin host bila memang disengaja.`)
  if (!allowed && /^(localhost|.*\.localhost|.*\.local|.*\.internal)$/i.test(host)) throw new NetError(`Host ${host} adalah host lokal dan diblokir. Tambahkan ke daftar izin host bila memang disengaja.`)
  return { u, allowed }
}

/**
 * Request aman.
 *  opts: { method, headers, body (string|Buffer), timeoutMs, maxBytes }
 *  → { status, headers, buffer, contentType, url }
 */
export async function safeRequest(rawUrl, opts = {}) {
  const timeoutMs = Math.min(30000, Math.max(1000, Number(opts.timeoutMs) || 15000))
  const maxBytes = Math.min(50 * 1048576, Math.max(1024, Number(opts.maxBytes) || 5 * 1048576))
  const deadline = AbortSignal.timeout(timeoutMs)
  let method = String(opts.method || 'GET').toUpperCase()
  let body = opts.body
  let url = rawUrl
  for (let hop = 0; hop <= 3; hop++) {
    const { u, allowed } = checkUrl(url)
    let res
    try {
      res = await request(u.toString(), {
        method,
        headers: { 'user-agent': 'xorizn-bot/1.0', ...(opts.headers || {}) },
        body: method === 'GET' || method === 'HEAD' ? undefined : body,
        dispatcher: allowed ? openAgent : guardedAgent,
        signal: deadline
      })
    } catch (err) {
      if (err instanceof NetError || err?.cause instanceof NetError) throw err instanceof NetError ? err : err.cause
      if (err?.name === 'AbortError' || err?.name === 'TimeoutError' || /aborted|timeout/i.test(err?.message || '')) throw new NetError(`API tidak merespons dalam ${timeoutMs / 1000} detik.`)
      throw new NetError(`Gagal menghubungi ${u.hostname}: ${err?.code || err?.message || err}`)
    }
    if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
      await res.body.dump().catch(() => {})
      if (hop === 3) throw new NetError('Terlalu banyak redirect.')
      url = new URL(String(res.headers.location), u).toString()
      if (res.statusCode === 303 || ((res.statusCode === 301 || res.statusCode === 302) && method === 'POST')) {
        method = 'GET'
        body = undefined
      }
      continue
    }
    const declared = Number(res.headers['content-length'] || 0)
    if (declared > maxBytes) {
      await res.body.dump().catch(() => {})
      throw new NetError(`Respons terlalu besar (${(declared / 1048576).toFixed(1)} MB, batas ${(maxBytes / 1048576).toFixed(0)} MB).`)
    }
    const chunks = []
    let size = 0
    for await (const chunk of res.body) {
      size += chunk.length
      if (size > maxBytes) {
        res.body.destroy()
        throw new NetError(`Respons terlalu besar (batas ${(maxBytes / 1048576).toFixed(0)} MB).`)
      }
      chunks.push(chunk)
    }
    return { status: res.statusCode, headers: res.headers, buffer: Buffer.concat(chunks), contentType: String(res.headers['content-type'] || ''), url: u.toString() }
  }
  throw new NetError('Terlalu banyak redirect.')
}

/** Ubah buffer respons jadi nilai: JSON bila memungkinkan, teks, atau buffer mentah. */
export function parseBody(res, type = 'auto') {
  const ct = res.contentType.toLowerCase()
  const asText = () => res.buffer.toString('utf8')
  if (type === 'buffer') return res.buffer
  if (type === 'text') return asText()
  if (type === 'json' || /json/.test(ct) || (type === 'auto' && /^[\s]*[[{]/.test(res.buffer.slice(0, 64).toString('utf8')))) {
    try {
      return JSON.parse(asText())
    } catch {
      if (type === 'json') throw new NetError('Respons API bukan JSON yang valid.')
    }
  }
  if (/^text\/|xml|javascript|html/.test(ct) || !ct) return asText()
  return res.buffer
}
