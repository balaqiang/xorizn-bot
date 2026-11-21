// Alat teknis & jaringan: JWT, cron, subnet, chmod, kode HTTP, DNS, SSL, cek situs, URL, kontras warna
const dns = require('dns').promises
const tls = require('tls')
const kit = require('../../lib/kit')
const { panel } = require('../../lib/uitext')
const { assertPublicUrl } = require('../../lib/safeurl')
const io = require('../../lib/imgops')

const fail = (msg) => Object.assign(new Error(msg), { userMessage: msg })
const withTimeout = (p, ms, what) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(fail(`${what} terlalu lama merespons.`)), ms))])
const WIB = (d) => new Date(d).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' })

// ---------- JWT ----------
const b64json = (s) => JSON.parse(Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'))
function jwt(token) {
  const parts = token.trim().replace(/^Bearer\s+/i, '').split('.')
  if (parts.length < 2 || parts.length > 3) throw fail('Format JWT tidak valid (harus 3 bagian dipisah titik).')
  let h, p
  try { h = b64json(parts[0]); p = b64json(parts[1]) } catch { throw fail('Isi JWT tidak bisa dibaca (bukan base64url/JSON).') }
  const times = ['iat', 'nbf', 'exp'].filter((k) => typeof p[k] === 'number').map((k) => `${{ iat: 'Diterbitkan', nbf: 'Berlaku sejak', exp: 'Kedaluwarsa' }[k]} : ${WIB(p[k] * 1000)}`)
  const expired = typeof p.exp === 'number' ? p.exp * 1000 < Date.now() : null
  return panel('JWT', [
    { head: '🔐 *HEADER*', lines: Object.entries(h).map(([k, v]) => `${k} : ${typeof v === 'object' ? JSON.stringify(v) : v}`) },
    { head: '📦 *PAYLOAD*', lines: Object.entries(p).map(([k, v]) => `${k} : ${typeof v === 'object' ? JSON.stringify(v) : v}`).slice(0, 25) },
    { head: '⏰ *WAKTU*', lines: [...times, expired === null ? '' : expired ? '⚠️ Token sudah kedaluwarsa' : '✅ Token masih berlaku'].filter(Boolean) }
  ], { tip: '💡 Hanya dibaca, tanda tangan tidak diverifikasi. Jangan bagikan token asli.' })
}

// ---------- cron ----------
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const DOWS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const FIELDS = [
  { name: 'menit', min: 0, max: 59 }, { name: 'jam', min: 0, max: 23 }, { name: 'tanggal', min: 1, max: 31 },
  { name: 'bulan', min: 1, max: 12, names: MONTHS, off: 1 }, { name: 'hari', min: 0, max: 7, names: DOWS }
]
function cronField(src, f) {
  const set = new Set()
  for (const part of src.toLowerCase().split(',')) {
    const [rng, stepS] = part.split('/')
    const step = stepS === undefined ? 1 : Number(stepS)
    if (!Number.isInteger(step) || step < 1) throw fail(`Langkah "${part}" pada ${f.name} tidak valid.`)
    const val = (t) => {
      if (f.names && f.names.indexOf(t) >= 0) return f.names.indexOf(t) + (f.off || 0)
      if (!/^\d+$/.test(t)) throw fail(`Nilai "${t}" pada ${f.name} tidak valid.`)
      return Number(t)
    }
    let lo
    let hi
    if (rng === '*' || rng === '?') { lo = f.min; hi = f.name === 'hari' ? 6 : f.max } else if (rng.includes('-')) { const [a, b] = rng.split('-'); lo = val(a); hi = val(b) } else { lo = val(rng); hi = stepS === undefined ? lo : f.name === 'hari' ? 6 : f.max }
    if (lo < f.min || hi > f.max || lo > hi) throw fail(`Rentang ${f.name} harus ${f.min}-${f.max}.`)
    for (let v = lo; v <= hi; v += step) set.add(f.name === 'hari' && v === 7 ? 0 : v)
  }
  return set
}
const ALIASES = { '@yearly': '0 0 1 1 *', '@annually': '0 0 1 1 *', '@monthly': '0 0 1 * *', '@weekly': '0 0 * * 0', '@daily': '0 0 * * *', '@midnight': '0 0 * * *', '@hourly': '0 * * * *' }
function cron(expr) {
  expr = ALIASES[expr.trim().toLowerCase()] || expr.trim()
  const parts = expr.split(/\s+/)
  if (parts.length !== 5) throw fail('Cron harus 5 kolom: menit jam tanggal bulan hari. Contoh: */15 8-17 * * 1-5')
  const sets = parts.map((p, i) => cronField(p, FIELDS[i]))
  const [mi, ho, dom, mo, dow] = sets
  const domStar = /^[*?]/.test(parts[2])
  const dowStar = /^[*?]/.test(parts[4])
  const next = []
  const t = new Date()
  t.setSeconds(0, 0)
  t.setMinutes(t.getMinutes() + 1)
  // dihitung dalam waktu server; tampil sebagai WIB
  for (let i = 0; i < 525600 * 2 && next.length < 5; i++, t.setMinutes(t.getMinutes() + 1)) {
    if (!mi.has(t.getMinutes()) || !ho.has(t.getHours()) || !mo.has(t.getMonth() + 1)) continue
    const dm = dom.has(t.getDate())
    const dw = dow.has(t.getDay())
    if (domStar && dowStar ? true : domStar ? dw : dowStar ? dm : dm || dw) next.push(new Date(t))
  }
  const desc = parts.map((p, i) => `${FIELDS[i].name} : ${p}  →  ${p === '*' ? 'setiap' : [...sets[i]].slice(0, 12).join(', ') + (sets[i].size > 12 ? ', …' : '')}`)
  return panel('CRON', [
    { head: '🧩 *KOLOM*', lines: [`Ekspresi : ${expr}`, ...desc] },
    { head: '⏭️ *5 JADWAL BERIKUTNYA*', lines: next.length ? next.map((d, i) => `${i + 1}. ${d.toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}`) : ['Tidak ada jadwal dalam 2 tahun ke depan.'] }
  ], { tip: '💡 Waktu mengikuti zona server bot.' })
}

// ---------- subnet ----------
const ip2n = (s) => {
  const p = s.split('.').map(Number)
  if (p.length !== 4 || p.some((x) => !Number.isInteger(x) || x < 0 || x > 255)) throw fail('Alamat IPv4 tidak valid.')
  return ((p[0] << 24) >>> 0) + (p[1] << 16) + (p[2] << 8) + p[3]
}
const n2ip = (n) => [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.')
function subnet(input) {
  const m = input.trim().match(/^(\d+\.\d+\.\d+\.\d+)(?:\/(\d{1,2})|\s+(\d+\.\d+\.\d+\.\d+))?$/)
  if (!m) throw fail('Format: 192.168.1.10/24 atau 192.168.1.10 255.255.255.0')
  let cidr = m[2] !== undefined ? Number(m[2]) : 24
  if (m[3]) {
    const mk = ip2n(m[3])
    const bin = mk.toString(2).padStart(32, '0')
    if (!/^1*0*$/.test(bin)) throw fail('Subnet mask tidak valid.')
    cidr = bin.indexOf('0') === -1 ? 32 : bin.indexOf('0')
  }
  if (cidr < 0 || cidr > 32) throw fail('CIDR harus 0-32.')
  const ip = ip2n(m[1])
  const mask = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0
  const net = (ip & mask) >>> 0
  const bc = (net | (~mask >>> 0)) >>> 0
  const total = 2 ** (32 - cidr)
  const hosts = cidr >= 31 ? total : total - 2
  const a = ip >>> 24
  const cls = a < 128 ? 'A' : a < 192 ? 'B' : a < 224 ? 'C' : a < 240 ? 'D (multicast)' : 'E (cadangan)'
  const priv = [[0x0a000000, 8], [0xac100000, 12], [0xc0a80000, 16], [0x7f000000, 8], [0xa9fe0000, 16]].some(([n, c]) => ((ip & ((0xffffffff << (32 - c)) >>> 0)) >>> 0) === n)
  return panel('KALKULATOR SUBNET', [
    { head: '🌐 *ALAMAT*', lines: [`IP : ${n2ip(ip)}/${cidr}`, `Subnet mask : ${n2ip(mask)}`, `Wildcard : ${n2ip(~mask >>> 0)}`, `Kelas : ${cls}`, `Jenis : ${priv ? 'Privat / lokal' : 'Publik'}`] },
    { head: '🧱 *JARINGAN*', lines: [`Network : ${n2ip(net)}`, `Broadcast : ${n2ip(bc)}`, `Host pertama : ${n2ip(cidr >= 31 ? net : net + 1)}`, `Host terakhir : ${n2ip(cidr >= 31 ? bc : bc - 1)}`, `Jumlah host : ${hosts.toLocaleString('id-ID')}`] },
    { head: '🔢 *BINER*', lines: [`IP : ${n2ip(ip).split('.').map((x) => Number(x).toString(2).padStart(8, '0')).join('.')}`, `Mask : ${n2ip(mask).split('.').map((x) => Number(x).toString(2).padStart(8, '0')).join('.')}`] }
  ])
}

// ---------- chmod ----------
function chmod(input) {
  const s = input.trim()
  let oct
  if (/^[0-7]{3,4}$/.test(s)) oct = s.slice(-3)
  else if (/^[-rwxsStT]{9}$/.test(s)) oct = [0, 3, 6].map((i) => [...s.slice(i, i + 3)].reduce((a, c, k) => a + (c === 'r' && k === 0 ? 4 : c === 'w' && k === 1 ? 2 : /[xst]/.test(c) && k === 2 ? 1 : 0), 0)).join('')
  else throw fail('Contoh: .chmod 755  atau  .chmod rwxr-xr-x')
  const sym = [...oct].map((d) => ['r', 'w', 'x'].map((c, i) => (Number(d) & (4 >> i) ? c : '-')).join('')).join('')
  const who = ['Pemilik (user)', 'Grup', 'Lainnya']
  const explain = (d) => [Number(d) & 4 && 'baca', Number(d) & 2 && 'tulis', Number(d) & 1 && 'eksekusi'].filter(Boolean).join(', ') || 'tidak ada akses'
  return panel('CHMOD', [
    { head: '🔑 *IZIN*', lines: [`Oktal : ${oct}`, `Simbolik : ${sym}`, `Perintah : chmod ${oct} namafile`] },
    { head: '👥 *RINCIAN*', lines: [...oct].map((d, i) => `${who[i]} : ${explain(d)}`) }
  ])
}

// ---------- kode HTTP ----------
const HTTP = {
  100: ['Continue', 'Server menerima awal permintaan, klien boleh lanjut mengirim.'], 101: ['Switching Protocols', 'Server setuju berpindah protokol (mis. WebSocket).'], 102: ['Processing', 'Permintaan sedang diproses (WebDAV).'], 103: ['Early Hints', 'Petunjuk awal header sebelum respons akhir.'],
  200: ['OK', 'Permintaan berhasil.'], 201: ['Created', 'Sumber daya baru berhasil dibuat.'], 202: ['Accepted', 'Permintaan diterima tapi belum selesai diproses.'], 203: ['Non-Authoritative Information', 'Respons berasal dari salinan perantara.'], 204: ['No Content', 'Berhasil, tidak ada isi untuk dikirim.'], 205: ['Reset Content', 'Berhasil, klien diminta mereset tampilan.'], 206: ['Partial Content', 'Sebagian isi dikirim (permintaan Range).'],
  300: ['Multiple Choices', 'Ada beberapa pilihan sumber daya.'], 301: ['Moved Permanently', 'Alamat pindah permanen ke URL baru.'], 302: ['Found', 'Pindah sementara ke URL lain.'], 303: ['See Other', 'Ambil hasilnya dari URL lain dengan GET.'], 304: ['Not Modified', 'Isi tidak berubah, pakai cache.'], 307: ['Temporary Redirect', 'Pindah sementara, metode permintaan dipertahankan.'], 308: ['Permanent Redirect', 'Pindah permanen, metode permintaan dipertahankan.'],
  400: ['Bad Request', 'Permintaan tidak valid / salah format.'], 401: ['Unauthorized', 'Perlu autentikasi (login/token).'], 402: ['Payment Required', 'Perlu pembayaran (jarang dipakai).'], 403: ['Forbidden', 'Dilarang: server paham tapi menolak akses.'], 404: ['Not Found', 'Sumber daya tidak ditemukan.'], 405: ['Method Not Allowed', 'Metode HTTP tidak diizinkan untuk alamat ini.'], 406: ['Not Acceptable', 'Server tak bisa memberi format yang diminta.'], 407: ['Proxy Authentication Required', 'Perlu autentikasi proxy.'], 408: ['Request Timeout', 'Server menunggu permintaan terlalu lama.'], 409: ['Conflict', 'Bentrok dengan keadaan sumber daya saat ini.'], 410: ['Gone', 'Sumber daya sudah dihapus permanen.'], 411: ['Length Required', 'Header Content-Length wajib.'], 412: ['Precondition Failed', 'Prasyarat header tidak terpenuhi.'], 413: ['Payload Too Large', 'Isi permintaan terlalu besar.'], 414: ['URI Too Long', 'Alamat URL terlalu panjang.'], 415: ['Unsupported Media Type', 'Format isi tidak didukung.'], 416: ['Range Not Satisfiable', 'Rentang yang diminta tidak valid.'], 417: ['Expectation Failed', 'Header Expect tidak bisa dipenuhi.'], 418: ["I'm a teapot", 'Lelucon April Mop: server adalah teko teh ☕.'], 421: ['Misdirected Request', 'Permintaan dikirim ke server yang salah.'], 422: ['Unprocessable Content', 'Format benar tapi isinya tak bisa diproses (validasi gagal).'], 423: ['Locked', 'Sumber daya terkunci.'], 424: ['Failed Dependency', 'Gagal karena permintaan lain yang menjadi syarat gagal.'], 425: ['Too Early', 'Server menolak memproses permintaan yang bisa diulang.'], 426: ['Upgrade Required', 'Klien harus upgrade protokol.'], 428: ['Precondition Required', 'Server mewajibkan prasyarat.'], 429: ['Too Many Requests', 'Terlalu banyak permintaan (rate limit).'], 431: ['Request Header Fields Too Large', 'Header permintaan terlalu besar.'], 451: ['Unavailable For Legal Reasons', 'Diblokir karena alasan hukum.'],
  500: ['Internal Server Error', 'Kesalahan tak terduga di server.'], 501: ['Not Implemented', 'Server tidak mendukung fungsi yang diminta.'], 502: ['Bad Gateway', 'Gateway mendapat respons tak valid dari server hulu.'], 503: ['Service Unavailable', 'Server sedang sibuk / perawatan.'], 504: ['Gateway Timeout', 'Gateway kehabisan waktu menunggu server hulu.'], 505: ['HTTP Version Not Supported', 'Versi HTTP tidak didukung.'], 507: ['Insufficient Storage', 'Penyimpanan server penuh.'], 508: ['Loop Detected', 'Server mendeteksi perulangan tak berujung.'], 511: ['Network Authentication Required', 'Perlu login jaringan (mis. WiFi publik).']
}
function httpStatus(arg) {
  const q = arg.trim()
  if (/^\d{3}$/.test(q)) {
    const h = HTTP[q]
    if (!h) throw fail(`Kode ${q} tidak ada di daftar standar.`)
    return panel('KODE HTTP', [{ head: `📡 *${q} ${h[0].toUpperCase()}*`, lines: [h[1], `Kelompok : ${{ 1: 'Informasi', 2: 'Sukses', 3: 'Pengalihan', 4: 'Kesalahan klien', 5: 'Kesalahan server' }[q[0]]}`], plain: true }])
  }
  if (/^[1-5]xx$/i.test(q)) {
    const g = q[0]
    return panel(`HTTP ${q.toUpperCase()}`, [{ head: `📚 *KELOMPOK ${q.toUpperCase()}*`, lines: Object.entries(HTTP).filter(([k]) => k[0] === g).map(([k, v]) => `${k} ${v[0]}`) }])
  }
  const hits = Object.entries(HTTP).filter(([k, v]) => v[0].toLowerCase().includes(q.toLowerCase()) || v[1].toLowerCase().includes(q.toLowerCase())).slice(0, 12)
  if (!hits.length) throw fail('Tidak ketemu. Ketik kode (404), kelompok (4xx), atau kata kunci (timeout).')
  return panel('KODE HTTP', [{ head: `🔎 *HASIL "${q}"*`, lines: hits.map(([k, v]) => `${k} ${v[0]} — ${v[1]}`) }])
}

// ---------- DNS ----------
const host = (arg) => {
  const h = String(arg).trim().replace(/^https?:\/\//i, '').split(/[/?#]/)[0].replace(/:\d+$/, '').toLowerCase()
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(h)) throw fail('Nama domain tidak valid. Contoh: google.com')
  return h
}
async function dnsLookup(arg) {
  const h = host(arg)
  const tryit = (p) => withTimeout(p, 8000, 'DNS').catch(() => null)
  const [a, aaaa, mx, ns, txt, cname] = await Promise.all([tryit(dns.resolve4(h)), tryit(dns.resolve6(h)), tryit(dns.resolveMx(h)), tryit(dns.resolveNs(h)), tryit(dns.resolveTxt(h)), tryit(dns.resolveCname(h))])
  if (![a, aaaa, mx, ns, txt, cname].some((x) => x && x.length)) throw fail(`Domain ${h} tidak ditemukan atau tidak punya record DNS.`)
  return panel(`DNS ${h.toUpperCase()}`, [
    { head: '🌐 *A (IPv4)*', lines: a || [] },
    { head: '🌐 *AAAA (IPv6)*', lines: (aaaa || []).slice(0, 6) },
    { head: '🔗 *CNAME*', lines: cname || [] },
    { head: '✉️ *MX*', lines: (mx || []).sort((x, y) => x.priority - y.priority).map((m) => `${m.priority} ${m.exchange}`) },
    { head: '🧭 *NS*', lines: ns || [] },
    { head: '📝 *TXT*', lines: (txt || []).map((t) => t.join('').slice(0, 110)).slice(0, 6) }
  ])
}

// ---------- SSL ----------
async function ssl(arg) {
  const h = host(arg)
  await assertPublicUrl(`https://${h}`)
  const info = await withTimeout(new Promise((resolve, reject) => {
    const s = tls.connect({ host: h, port: 443, servername: h, rejectUnauthorized: false, timeout: 8000 }, () => {
      const c = s.getPeerCertificate()
      const out = { cert: c, proto: s.getProtocol(), authorized: s.authorized, authError: s.authorizationError }
      s.end()
      resolve(out)
    })
    s.on('error', reject)
    s.on('timeout', () => { s.destroy(); reject(new Error('timeout')) })
  }), 10000, 'Koneksi SSL').catch((e) => { throw e.userMessage ? e : fail(`Tidak bisa terhubung ke ${h}:443 (${e.code || e.message}).`) })
  const c = info.cert
  if (!c || !c.valid_to) throw fail('Server tidak mengirim sertifikat.')
  const left = Math.floor((new Date(c.valid_to) - Date.now()) / 86400000)
  const org = (o) => (o && (o.O || o.CN)) || '-'
  return panel(`SSL ${h.toUpperCase()}`, [
    { head: '🔒 *STATUS*', lines: [info.authorized ? '✅ Sertifikat tepercaya' : `⚠️ Tidak tepercaya (${info.authError})`, left < 0 ? `❌ Kedaluwarsa ${-left} hari lalu` : `Sisa masa berlaku : ${left} hari${left < 15 ? ' ⚠️ segera perpanjang' : ''}`, `Protokol : ${info.proto}`] },
    { head: '📜 *SERTIFIKAT*', lines: [`Untuk : ${c.subject?.CN || '-'}`, `Penerbit : ${org(c.issuer)}`, `Berlaku : ${WIB(c.valid_from)}`, `Sampai : ${WIB(c.valid_to)}`] },
    { head: '🌐 *NAMA ALTERNATIF*', lines: String(c.subjectaltname || '').split(', ').map((x) => x.replace(/^DNS:/, '')).filter(Boolean).slice(0, 10) }
  ])
}

// ---------- cek situs ----------
async function cekweb(arg) {
  const url = /^https?:\/\//i.test(arg.trim()) ? arg.trim() : `https://${arg.trim()}`
  await assertPublicUrl(url)
  const t0 = Date.now()
  let res
  let hops = 0
  let cur = url
  for (; hops < 5; hops++) {
    await assertPublicUrl(cur)
    res = await fetch(cur, { redirect: 'manual', headers: { 'User-Agent': 'Mozilla/5.0 xorizn-bot-check' }, signal: AbortSignal.timeout(15000) }).catch((e) => { throw fail(`Tidak bisa dijangkau: ${e.cause?.code || e.message}`) })
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) cur = new URL(res.headers.get('location'), cur).href
    else break
  }
  const ms = Date.now() - t0
  const text = (await res.text()).slice(0, 200000)
  const title = (text.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').replace(/\s+/g, ' ').trim().slice(0, 100)
  const h = (k) => res.headers.get(k)
  return panel('CEK SITUS', [
    { head: '📡 *RESPON*', lines: [`Status : ${res.status} ${HTTP[res.status]?.[0] || res.statusText} ${res.status < 400 ? '✅' : '❌'}`, `Waktu : ${ms} ms`, `Pengalihan : ${hops}x`, `URL akhir : ${cur}`] },
    { head: '🖥️ *SERVER*', lines: [h('server') && `Server : ${h('server')}`, h('content-type') && `Tipe : ${h('content-type')}`, h('content-length') && `Ukuran : ${kit.fmtSize(Number(h('content-length')))}`, h('x-powered-by') && `Teknologi : ${h('x-powered-by')}`, h('cf-ray') && 'CDN : Cloudflare', h('strict-transport-security') && 'HSTS : aktif'].filter(Boolean) },
    { head: '📄 *HALAMAN*', lines: title ? [`Judul : ${title}`] : [] }
  ])
}

// ---------- URL ----------
function urlparse(arg) {
  let u
  try { u = new URL(/^[a-z]+:\/\//i.test(arg.trim()) ? arg.trim() : `https://${arg.trim()}`) } catch { throw fail('URL tidak valid.') }
  const q = [...u.searchParams.entries()]
  return panel('URL PARSER', [
    { head: '🔗 *KOMPONEN*', lines: [`Protokol : ${u.protocol.replace(':', '')}`, `Host : ${u.hostname}`, u.port && `Port : ${u.port}`, `Path : ${u.pathname}`, u.hash && `Hash : ${u.hash}`, u.username && `Pengguna : ${u.username}`].filter(Boolean) },
    { head: '❓ *PARAMETER*', lines: q.slice(0, 20).map(([k, v]) => `${k} = ${v}`) }
  ])
}

// ---------- kontras warna WCAG ----------
const lum = ([r, g, b]) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0)
function contrast(a1, a2) {
  const c1 = io.parseColor(a1)
  const c2 = io.parseColor(a2)
  if (!c1 || !c2) throw fail('Warna tidak dikenali. Pakai hex (#1a1a1a) atau nama (putih, hitam, biru).')
  const l1 = lum(io.hexToRgb(c1))
  const l2 = lum(io.hexToRgb(c2))
  const r = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
  const ok = (v) => (r >= v ? '✅ lulus' : '❌ gagal')
  return panel('KONTRAS WARNA', [
    { head: '🎨 *WARNA*', lines: [`Warna 1 : ${c1}`, `Warna 2 : ${c2}`, `Rasio kontras : ${r.toFixed(2)} : 1`] },
    { head: '♿ *WCAG*', lines: [`AA teks normal (4.5) : ${ok(4.5)}`, `AA teks besar (3) : ${ok(3)}`, `AAA teks normal (7) : ${ok(7)}`, `AAA teks besar (4.5) : ${ok(4.5)}`] }
  ])
}

const specs = {
  jwt: { desc: 'Baca isi token JWT (header, payload, masa berlaku)', usage: '<token>', args: true, run: async (c) => jwt(c.text) },
  cron: { desc: 'Jelaskan ekspresi cron + 5 jadwal berikutnya', usage: '<5 kolom cron>', example: '*/15 8-17 * * 1-5', args: true, run: async (c) => cron(c.text) },
  subnet: { desc: 'Kalkulator subnet IPv4 (network, broadcast, host)', usage: '<ip/cidr>', example: '192.168.1.10/24', args: true, run: async (c) => subnet(c.text) },
  chmod: { desc: 'Konversi izin file Linux (755 ⇄ rwxr-xr-x)', usage: '<755|rwxr-xr-x>', example: '644', args: true, run: async (c) => chmod(c.text) },
  httpstatus: { desc: 'Arti kode status HTTP (404, 4xx, atau kata kunci)', usage: '<kode|kata>', example: '503', args: true, run: async (c) => httpStatus(c.text) },
  dns: { desc: 'Cek record DNS domain (A, AAAA, MX, NS, TXT)', usage: '<domain>', example: 'google.com', args: true, heavy: true, run: async (c) => dnsLookup(c.text) },
  cekssl: { desc: 'Cek sertifikat SSL: penerbit & sisa masa berlaku', usage: '<domain>', example: 'github.com', args: true, heavy: true, run: async (c) => ssl(c.text) },
  cekweb: { desc: 'Cek situs: status, kecepatan respons, server, judul', usage: '<url>', example: 'example.com', args: true, heavy: true, run: async (c) => cekweb(c.text) },
  urlparse: { desc: 'Bedah URL jadi komponen dan parameter', usage: '<url>', args: true, run: async (c) => urlparse(c.text) },
  kontras: { desc: 'Rasio kontras dua warna sesuai standar WCAG', usage: '<warna1> <warna2>', example: '#ffffff #1a73e8', args: true, run: async (c) => contrast(c.args[0], c.args[1]) }
}

module.exports = kit.multi({ name: 'devkit', category: 'tools', emoji: '🛠️', desc: 'Alat teknis & jaringan', specs })
