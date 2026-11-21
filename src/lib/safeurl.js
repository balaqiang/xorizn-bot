// lib/safeurl.js — ambil URL dari pengguna dengan aman (anti-SSRF)
//
// Fitur yang mengunduh link kiriman pengguna (swgc, stalk, dll) tidak boleh bisa disuruh membuka alamat
// internal server (localhost, 192.168.x.x, metadata cloud 169.254.x.x, dst). Semua alamat dicek sebelum dibuka,
// termasuk setiap pengalihan (redirect).
'use strict'

const dns = require('dns').promises
const net = require('net')

function privateIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number)
    return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224
  }
  if (net.isIPv6(ip)) {
    const x = ip.toLowerCase()
    if (x === '::1' || x === '::' || x.startsWith('fc') || x.startsWith('fd') || x.startsWith('fe80')) return true
    const m = x.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
    return m ? privateIp(m[1]) : false
  }
  return true
}

async function assertPublicUrl(raw) {
  let u
  try {
    u = new URL(String(raw))
  } catch {
    throw new Error('URL tidak valid')
  }
  if (!/^https?:$/.test(u.protocol)) throw new Error('Hanya link http/https yang diizinkan')
  if (u.username || u.password) throw new Error('URL tidak boleh memuat kredensial')
  const host = u.hostname.replace(/^\[|\]$/g, '')
  if (/^localhost$|\.local$|\.internal$|\.localhost$/i.test(host)) throw new Error('Alamat tidak diizinkan')
  const addrs = net.isIP(host) ? [{ address: host }] : await dns.lookup(host, { all: true })
  if (!addrs.length || addrs.some((a) => privateIp(a.address))) throw new Error('Alamat tidak diizinkan')
  return u
}

// -> { buffer, contentType, url }
async function fetchPublic(raw, { maxBytes = 25 * 1024 * 1024, timeout = 30000, headers = {}, hops = 3 } = {}) {
  let url = String(raw)
  for (let i = 0; i <= hops; i++) {
    await assertPublicUrl(url)
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', ...headers }, redirect: 'manual', signal: AbortSignal.timeout(timeout) })
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      url = new URL(res.headers.get('location'), url).href
      continue
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    if (Number(res.headers.get('content-length') || 0) > maxBytes) throw new Error('File terlalu besar')
    const buffer = Buffer.from(await res.arrayBuffer())
    if (buffer.length > maxBytes) throw new Error('File terlalu besar')
    return { buffer, contentType: res.headers.get('content-type') || '', url }
  }
  throw new Error('Terlalu banyak pengalihan')
}

module.exports = { assertPublicUrl, fetchPublic, privateIp }
