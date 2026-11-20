// lib/autopanel.js — mesin Auto Beli Panel (reseller API shoppanel): order + QRIS, pantau pembayaran, kirim data panel otomatis.
// Perintah didaftarkan di plugins/panel/autopanel.js; plugins/panel/autopanel-hook.js melanjutkan pemantauan setelah restart.
'use strict'

const axios = require('axios')
const { card, rows, btn } = require('./shopui')
const { createStore } = require('./store')

const BASE = 'https://zanspiwptero.shoppanel.my.id/api/v1'
// API key diatur di settings.js -> global.apiKeys.shoppanel = 'sk_live_...'
const apiKey = () => (global.apiKeys && global.apiKeys.shoppanel) || ''

const POLL_MS = 8000
const MAX_WAIT = 20 * 60 * 1000 // berhenti memantau setelah 20 menit (invoice biasanya sudah kedaluwarsa)

const db = createStore('autopanel', { pending: {} })
const watching = new Map() // id -> timer

// ---------------------------------------------------------------- HTTP
async function api(method, path, { body, params } = {}) {
  if (!apiKey()) throw new Error('API key panel belum diisi. Owner: isi global.apiKeys.shoppanel di settings.js.')
  let res
  try {
    res = await axios({
      method, url: BASE + path, params, data: body, timeout: 30000,
      headers: { Authorization: `Bearer ${apiKey()}`, 'Content-Type': 'application/json', Accept: 'application/json' },
      validateStatus: () => true
    })
  } catch (e) {
    throw new Error('Server panel tidak bisa dihubungi: ' + (e.code || e.message))
  }
  const d = res.data
  const msg = d && typeof d === 'object' ? d.message || d.error || d.msg : ''
  if (res.status >= 400 || (d && typeof d === 'object' && (d.success === false || d.status === false || d.status === 'error'))) {
    throw new Error(friendly(String(msg || `HTTP ${res.status}`), res.status))
  }
  if (typeof d === 'string' && /^\s*<(!doctype|html)/i.test(d)) throw new Error(friendly('<!DOCTYPE', res.status))
  return d
}
// pesan error server yang kurang jelas diubah jadi bahasa manusia
function friendly(m, status) {
  if (/<!doctype|<html|not valid json|unexpected token/i.test(m)) return 'Server penyedia panel sedang bermasalah (balasannya bukan data yang valid).\nCoba lagi beberapa saat, atau pilih produk lain. Kalau terus begini, hubungi penyedia panel.'
  if (/invalid api|unauthori|api key/i.test(m) || status === 401) return 'API key ditolak server panel. Cek global.apiKeys.shoppanel di settings.js.'
  if (/stock|stok|habis|sold/i.test(m)) return 'Stok produk ini sedang habis.'
  return m.slice(0, 300)
}
// ambil isi utama dari pembungkus { success, data: ... }
const unwrap = (d) => (d && typeof d === 'object' && !Array.isArray(d) && d.data !== undefined && d.data !== null ? d.data : d)

// ---------------------------------------------------------------- util tampilan
const rp = (n) => {
  const v = Number(String(n).replace(/[^\d.-]/g, ''))
  return Number.isFinite(v) && String(n).trim() !== '' ? 'Rp' + v.toLocaleString('id-ID') : String(n)
}
const pick = (o, keys) => { for (const k of keys) if (o && o[k] !== undefined && o[k] !== null && o[k] !== '') return o[k]; return undefined }
const LABEL = {
  id: 'ID', productId: 'Produk', product: 'Produk', name: 'Nama', username: 'Username', password: 'Password', email: 'Email',
  panelUrl: 'Panel', panel_url: 'Panel', domain: 'Panel', url: 'Link', loginUrl: 'Login', serverId: 'Server ID', server_id: 'Server ID',
  status: 'Status', total: 'Total', amount: 'Total', price: 'Harga', fee: 'Biaya', invoice: 'Invoice', invoiceId: 'Invoice', orderId: 'Order',
  transactionId: 'Transaksi', trxId: 'Transaksi', createdAt: 'Dibuat', expiredAt: 'Kedaluwarsa', expiresAt: 'Kedaluwarsa', expiry: 'Kedaluwarsa',
  paidAt: 'Dibayar', ram: 'RAM', cpu: 'CPU', disk: 'Disk', stock: 'Stok', description: 'Deskripsi', warranty: 'Garansi', expired: 'Masa aktif'
}
const SKIP = /qr|image|base64|signature|token|secret|raw|callback|^_/i
const label = (k) => LABEL[k] || k.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ').replace(/^./, (c) => c.toUpperCase())
const money = /^(total|amount|price|fee|harga|biaya|subtotal|admin)/i
// objek -> baris "Label : nilai" (satu tingkat ke dalam, tanpa field teknis)
function flat(o, max = 24) {
  const out = []
  const walk = (obj, pre = '') => {
    for (const [k, v] of Object.entries(obj || {})) {
      if (out.length >= max || SKIP.test(k) || v === null || v === undefined || v === '') continue
      if (Array.isArray(v)) { if (v.every((x) => typeof x !== 'object')) out.push([pre + label(k), v.join(', ')]); continue }
      if (typeof v === 'object') { if (!pre) walk(v, label(k) + ' '); continue }
      out.push([pre + label(k), money.test(k) ? rp(v) : String(v)])
    }
  }
  walk(o)
  return out
}
const table = (pairs) => {
  const w = Math.min(14, Math.max(...pairs.map(([k]) => k.length), 4))
  return pairs.map(([k, v]) => `${k.padEnd(w)} : ${v}`).join('\n')
}
const norm = (s) => String(s || '').toLowerCase()
const isPaid = (s) => /paid|success|settle|complete|lunas|berhasil|done|active/.test(norm(s)) && !/unpaid|not/.test(norm(s))
const isDead = (s) => /expire|fail|cancel|gagal|batal|kadaluarsa|kedaluwarsa|void|reject/.test(norm(s))
const statusText = (s) => (isPaid(s) ? 'LUNAS' : isDead(s) ? 'GAGAL / KEDALUWARSA' : 'MENUNGGU PEMBAYARAN')
const statusOf = (d) => pick(d, ['status', 'paymentStatus', 'payment_status', 'state'])

// QR: dukung URL gambar, data-URI/base64, atau string QRIS mentah (diubah jadi gambar)
async function qrBuffer(o) {
  const v = pick(o, ['qrImage', 'qr_image', 'qrUrl', 'qr_url', 'qrisUrl', 'qris_url', 'qrisImage', 'qris_image', 'qr', 'qris', 'qrString', 'qr_string', 'qrCode', 'qr_code'])
  if (!v || typeof v !== 'string') return null
  try {
    if (/^https?:\/\//i.test(v)) {
      const r = await axios.get(v, { responseType: 'arraybuffer', timeout: 20000 })
      if (/image/.test(String(r.headers['content-type'] || ''))) return Buffer.from(r.data)
      return null
    }
    if (/^data:image/i.test(v)) return Buffer.from(v.split(',')[1], 'base64')
    if (/^[A-Za-z0-9+/=]{200,}$/.test(v) && !/^0002/.test(v)) return Buffer.from(v, 'base64')
    return await require('./autoorder').qrPng(v, 600) // QR dibuat lokal, tanpa paket tambahan
  } catch { return null }
}

const need = (ctx, usage) => ctx.reply(`Format salah.\n\n${usage}`)
const fail = (ctx, e) => ctx.reply(`*GAGAL*\n\n${e && e.message ? e.message : e}`)
const priv = (sock, jid) => (String(jid).endsWith('@g.us') ? null : jid)

// ---------------------------------------------------------------- pantau pembayaran otomatis
async function deliver(sock, rec, detail) {
  const d = unwrap(detail) || {}
  const pairs = flat(d)
  const body = ['*PEMBELIAN BERHASIL*', '', 'Terima kasih! Data panel kamu:', '', table(pairs), '', 'Simpan data ini baik-baik dan jangan dibagikan ke siapa pun.'].join('\n')
  const buttons = []
  const loginUrl = pick(d, ['loginUrl', 'panelUrl', 'panel_url', 'domain', 'url'])
  if (loginUrl && /^https?:\/\//i.test(String(loginUrl))) buttons.push(btn.url('Buka Panel', String(loginUrl)))
  const pass = pick(d, ['password'])
  const user = pick(d, ['username'])
  if (user) buttons.push(btn.copy('Salin Username', String(user)))
  if (pass) buttons.push(btn.copy('Salin Password', String(pass)))
  buttons.push(btn.reply('Garansi', `${rec.prefix || '.'}garansipanel`))
  await card({ sock, from: rec.chat, msg: undefined, config: global.config || {} }, { title: 'AUTO ORDER PANEL', body, buttons, fallback: body })
}

function watch(sock, id) {
  if (watching.has(id)) return
  const rec = db.data.pending[id]
  if (!rec) return
  const started = rec.t || Date.now()
  const tick = async () => {
    const r = db.data.pending[id]
    if (!r) return watching.delete(id)
    try {
      if (Date.now() - started > MAX_WAIT) throw Object.assign(new Error('timeout'), { expired: true })
      const isRenew = r.kind === 'renew'
      const res = unwrap(await api('GET', isRenew ? `/check-renewal-payment/${encodeURIComponent(id)}` : `/check-payment/${encodeURIComponent(id)}`))
      const st = statusOf(res)
      if (isPaid(st) || res === true) {
        delete db.data.pending[id]; db.save(); watching.delete(id)
        if (isRenew) {
          const pairs = flat(res || {})
          const body = ['*PERPANJANGAN BERHASIL*', '', table(pairs.length ? pairs : [['Transaksi', id], ['Status', 'LUNAS']])].join('\n')
          return card({ sock, from: r.chat, config: global.config || {} }, { title: 'AUTO RENEW PANEL', body, fallback: body })
        }
        const detail = await api('GET', `/order-detail/${encodeURIComponent(id)}`).catch(() => ({ data: res }))
        return deliver(sock, r, detail)
      }
      if (isDead(st)) throw Object.assign(new Error(String(st)), { expired: true })
    } catch (e) {
      if (e.expired) {
        delete db.data.pending[id]; db.save(); watching.delete(id)
        const body = `*PEMBAYARAN TIDAK SELESAI*\n\nInvoice ${id} kedaluwarsa atau dibatalkan.\nUlangi dengan ${r.prefix || '.'}belipanel bila masih ingin membeli.`
        return sock.sendMessage(r.chat, { text: body }).catch(() => {})
      }
      // gangguan sementara (jaringan/API): coba lagi di putaran berikutnya
    }
    watching.set(id, setTimeout(tick, POLL_MS))
  }
  watching.set(id, setTimeout(tick, POLL_MS))
}

// ---------------------------------------------------------------- perintah
const U_BUY = (p) => `Cara beli panel (chat pribadi bot):\n${p}belipanel <id produk> <username> <password> <email>\n\nContoh:\n${p}belipanel public-1GB budi123 PasswordKuat123! budi@gmail.com\n\nLihat daftar produk: ${p}produkpanel`

async function produk(ctx) {
  const { prefix } = ctx
  const list = unwrap(await api('GET', '/products'))
  const arr = Array.isArray(list) ? list : Array.isArray(list && list.products) ? list.products : Object.values(list || {})
  if (!arr.length) return ctx.reply('Belum ada produk panel yang tersedia.')
  const items = arr.map((p) => ({
    id: String(pick(p, ['id', 'productId', 'product_id', 'code', 'slug', 'sku']) || ''),
    name: String(pick(p, ['name', 'title', 'label']) || pick(p, ['id', 'productId']) || '-'),
    price: pick(p, ['price', 'harga', 'amount']),
    stock: pick(p, ['stock', 'stok', 'available']),
    raw: p
  })).filter((x) => x.id)
  const lines = items.map((x, i) => {
    const extra = ['ram', 'cpu', 'disk'].map((k) => (x.raw[k] !== undefined ? `${k.toUpperCase()} ${x.raw[k]}` : '')).filter(Boolean).join(' • ')
    return `${i + 1}. *${x.name}*\n   ID    : ${x.id}\n   Harga : ${x.price !== undefined ? rp(x.price) : '-'}${x.stock !== undefined ? `\n   Stok  : ${x.stock === true ? 'Tersedia' : x.stock === false ? 'Habis' : x.stock}` : ''}${extra ? `\n   Spek  : ${extra}` : ''}`
  })
  const body = ['*DAFTAR PRODUK PANEL*', '', lines.join('\n\n'), '', `Beli: ${prefix}belipanel <id> <username> <password> <email>`].join('\n')
  const buttons = [btn.list('Pilih produk', [{ title: 'PRODUK PANEL', rows: items.slice(0, 20).map((x) => ({ header: '', title: x.name.slice(0, 24), description: `${x.price !== undefined ? rp(x.price) : ''} • ${x.id}`.slice(0, 72), id: `${prefix}belipanel ${x.id}` })) }])]
  return card(ctx, { title: 'PANEL', body, buttons, fallback: body })
}

async function beli(ctx) {
  const { args, prefix, sock, from, sender } = ctx
  if (ctx.isGroup) return ctx.reply(`Demi keamanan password, beli lewat chat pribadi bot ya.\n\nChat bot langsung lalu ketik:\n${prefix}belipanel <id> <username> <password> <email>`)
  const [productId, username, password, email] = args
  if (!productId) return need(ctx, U_BUY(prefix))
  if (!username || !password || !email) return need(ctx, `Produk *${productId}* dipilih. Lengkapi data:\n\n${prefix}belipanel ${productId} <username> <password> <email>`)
  if (!/^[a-zA-Z0-9_.-]{3,24}$/.test(username)) return ctx.reply('Username 3-24 karakter: huruf, angka, titik, strip, underscore (tanpa spasi).')
  if (password.length < 8) return ctx.reply('Password minimal 8 karakter.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return ctx.reply('Format email tidak valid.')
  await ctx.reply('Membuat order, tunggu sebentar...')
  try {
    const pl = unwrap(await api('GET', '/products'))
    const arr = Array.isArray(pl) ? pl : Array.isArray(pl && pl.products) ? pl.products : []
    const hit = arr.find((p) => String(pick(p, ['id', 'productId', 'product_id', 'code', 'slug', 'sku'])).toLowerCase() === productId.toLowerCase())
    if (arr.length && !hit) return ctx.reply(`Produk *${productId}* tidak ditemukan.\nLihat daftar ID yang benar di ${prefix}produkpanel`)
    if (hit && (hit.stock === false || Number(hit.stock) === 0)) return ctx.reply(`Produk *${productId}* sedang habis.`)
  } catch {}
  let o
  try { o = unwrap(await api('POST', '/create-order', { body: { productId, username, password, email } })) } catch (e) { return fail(ctx, e) }
  const inv = String(pick(o, ['invoiceId', 'invoice', 'orderId', 'order_id', 'id', 'trxId', 'transactionId', 'reference']) || '')
  if (!inv) return ctx.reply('Order dibuat, tetapi server tidak memberi nomor invoice. Cek ' + prefix + 'orderspanel (owner).')
  db.data.pending[inv] = { chat: from, sender, kind: 'order', prefix, t: Date.now() }
  db.save(); watch(sock, inv)

  const total = pick(o, ['total', 'amount', 'totalAmount', 'total_amount', 'price', 'grandTotal'])
  const pairs = [['Invoice', inv], ['Produk', productId], ['Username', username], ['Email', email]]
  if (total !== undefined) pairs.push(['Total', rp(total)])
  const exp = pick(o, ['expiredAt', 'expiresAt', 'expired_at', 'expiry', 'expireTime'])
  if (exp) pairs.push(['Batas bayar', String(exp)])
  const body = ['*ORDER PANEL DIBUAT*', '', table(pairs), '', 'Scan QRIS lalu bayar sesuai total.', 'Pembayaran dipantau otomatis, data panel dikirim ke chat ini begitu lunas.'].join('\n')
  const buttons = [btn.reply('Cek Pembayaran', `${prefix}cekpay ${inv}`), btn.copy('Salin Invoice', inv)]
  const payUrl = pick(o, ['paymentUrl', 'payment_url', 'checkoutUrl', 'checkout_url', 'payUrl', 'invoiceUrl'])
  if (payUrl && /^https?:\/\//i.test(String(payUrl))) buttons.unshift(btn.url('Bayar', String(payUrl)))
  const image = await qrBuffer(o)
  return card(ctx, { title: 'ORDER PANEL', image: image || undefined, body, buttons, fallback: body })
}

async function cekpay(ctx) {
  const inv = ctx.args[0]
  if (!inv) return need(ctx, `${ctx.prefix}cekpay <invoice>\nContoh: ${ctx.prefix}cekpay INV-171829-PUBLIC-1GB`)
  let r
  try { r = unwrap(await api('GET', `/check-payment/${encodeURIComponent(inv)}`)) } catch (e) { return fail(ctx, e) }
  const st = typeof r === 'object' ? statusOf(r) : r
  const pairs = [['Invoice', inv], ['Status', statusText(st) + (st ? ` (${st})` : '')], ...(typeof r === 'object' ? flat(r).filter(([k]) => k !== 'Status' && k !== 'Invoice') : [])]
  const body = ['*STATUS PEMBAYARAN*', '', table(pairs)].join('\n')
  const buttons = isPaid(st) ? [btn.reply('Detail Order', `${ctx.prefix}detailpanel ${inv}`)] : [btn.reply('Cek Lagi', `${ctx.prefix}cekpay ${inv}`)]
  return card(ctx, { title: 'CEK PEMBAYARAN', body, buttons, fallback: body })
}

async function detail(ctx) {
  const inv = ctx.args[0]
  if (!inv) return need(ctx, `${ctx.prefix}detailpanel <invoice>`)
  let r
  try { r = unwrap(await api('GET', `/order-detail/${encodeURIComponent(inv)}`)) } catch (e) { return fail(ctx, e) }
  // data login hanya dikirim ke chat pribadi
  const to = ctx.isGroup ? ctx.sender : ctx.from
  if (ctx.isGroup) await ctx.reply('Detail order dikirim ke chat pribadi kamu.')
  const body = ['*DETAIL ORDER PANEL*', '', table(flat(r && typeof r === 'object' ? r : { Hasil: r }))].join('\n')
  const buttons = []
  const user = r && r.username, pass = r && r.password
  if (user) buttons.push(btn.copy('Salin Username', String(user)))
  if (pass) buttons.push(btn.copy('Salin Password', String(pass)))
  return card(ctx, { title: 'DETAIL ORDER', body, buttons, fallback: body, to })
}

async function orders(ctx) {
  if (!ctx.isOwner) return ctx.reply(ctx.config.mess.only.owner)
  let r
  try { r = unwrap(await api('GET', '/orders')) } catch (e) { return fail(ctx, e) }
  const arr = Array.isArray(r) ? r : Array.isArray(r && r.orders) ? r.orders : []
  if (!arr.length) return ctx.reply('Belum ada order.')
  const lines = arr.slice(0, 25).map((o, i) => {
    const id = pick(o, ['invoiceId', 'invoice', 'orderId', 'id']) || '-'
    const st = statusOf(o)
    const tot = pick(o, ['total', 'amount', 'price'])
    return `${i + 1}. ${id}\n   ${pick(o, ['productId', 'product', 'name']) || ''}${tot !== undefined ? ' • ' + rp(tot) : ''} • ${st ? statusText(st) : '-'}`
  })
  const body = ['*DAFTAR ORDER PANEL*', `Total: ${arr.length}${arr.length > 25 ? ' (25 terbaru ditampilkan)' : ''}`, '', lines.join('\n'), '', `Detail: ${ctx.prefix}detailpanel <invoice>`].join('\n')
  return card(ctx, { title: 'ORDERS', body, fallback: body })
}

async function garansi(ctx) {
  let r
  try { r = unwrap(await api('GET', '/warranty-link')) } catch (e) { return fail(ctx, e) }
  const link = typeof r === 'string' ? r : pick(r, ['link', 'url', 'warrantyLink', 'warranty_link'])
  if (!link) return ctx.reply('Link garansi belum tersedia.')
  const body = ['*GARANSI PANEL*', '', 'Klaim garansi lewat link berikut:', String(link)].join('\n')
  return card(ctx, { title: 'GARANSI', body, buttons: [btn.url('Buka Garansi', String(link)), btn.copy('Salin Link', String(link))], fallback: body })
}

async function cekserver(ctx) {
  const [id, panelUrl] = ctx.args
  if (!id) return need(ctx, `${ctx.prefix}cekserver <serverId> [panelUrl]\nContoh: ${ctx.prefix}cekserver 123 https://panel.example.com`)
  let r
  try { r = unwrap(await api('GET', `/check-server/${encodeURIComponent(id)}`, { params: panelUrl ? { panelUrl } : undefined })) } catch (e) { return fail(ctx, e) }
  const pairs = typeof r === 'object' ? flat(r) : [['Hasil', String(r)]]
  const body = ['*CEK SERVER PANEL*', '', table([['Server ID', id], ...(panelUrl ? [['Panel', panelUrl]] : []), ...pairs.filter(([k]) => k !== 'Server ID' && k !== 'Panel')])].join('\n')
  return card(ctx, { title: 'CEK SERVER', body, buttons: [btn.reply('Perpanjang', `${ctx.prefix}renewpanel ${id}${panelUrl ? ' ' + panelUrl : ''}`)], fallback: body })
}

async function renew(ctx) {
  const { args, prefix, sock, from, sender } = ctx
  const [serverId, panelUrl] = args
  if (!serverId || !/^\d+$/.test(serverId)) return need(ctx, `${prefix}renewpanel <serverId> [panelUrl]\nContoh: ${prefix}renewpanel 123 https://panel.example.com`)
  await ctx.reply('Membuat tagihan perpanjangan...')
  const body = { serverId: Number(serverId) }
  if (panelUrl) body.panelUrl = panelUrl
  let o
  try { o = unwrap(await api('POST', '/create-renewal', { body })) } catch (e) { return fail(ctx, e) }
  const trx = String(pick(o, ['transactionId', 'trxId', 'invoiceId', 'invoice', 'id', 'reference']) || '')
  if (trx) { db.data.pending[trx] = { chat: from, sender, kind: 'renew', prefix, t: Date.now() }; db.save(); watch(sock, trx) }
  const pairs = [['Transaksi', trx || '-'], ['Server ID', serverId], ...flat(o && typeof o === 'object' ? o : {}).filter(([k]) => !/Transaksi|Server ID|Invoice|^ID$/i.test(k))]
  const text = ['*TAGIHAN PERPANJANGAN*', '', table(pairs), '', 'Bayar sesuai total. Status dipantau otomatis dan dikabari saat lunas.'].join('\n')
  const buttons = []
  if (trx) buttons.push(btn.reply('Cek Pembayaran', `${prefix}cekrenew ${trx}`), btn.copy('Salin ID', trx))
  const payUrl = pick(o, ['paymentUrl', 'payment_url', 'checkoutUrl', 'checkout_url', 'payUrl'])
  if (payUrl && /^https?:\/\//i.test(String(payUrl))) buttons.unshift(btn.url('Bayar', String(payUrl)))
  return card(ctx, { title: 'RENEWAL', image: (await qrBuffer(o)) || undefined, body: text, buttons, fallback: text })
}

async function cekrenew(ctx) {
  const trx = ctx.args[0]
  if (!trx) return need(ctx, `${ctx.prefix}cekrenew <TRX-RENEW-xxxxxx>`)
  let r
  try { r = unwrap(await api('GET', `/check-renewal-payment/${encodeURIComponent(trx)}`)) } catch (e) { return fail(ctx, e) }
  const st = typeof r === 'object' ? statusOf(r) : r
  const pairs = [['Transaksi', trx], ['Status', statusText(st) + (st ? ` (${st})` : '')], ...(typeof r === 'object' ? flat(r).filter(([k]) => !/^(Status|Transaksi)$/.test(k)) : [])]
  const body = ['*STATUS PERPANJANGAN*', '', table(pairs)].join('\n')
  return card(ctx, { title: 'CEK RENEWAL', body, buttons: isPaid(st) ? [] : [btn.reply('Cek Lagi', `${ctx.prefix}cekrenew ${trx}`)], fallback: body })
}

const HANDLERS = {
  produkpanel: produk, panel: produk, shoppanel: produk,
  belipanel: beli, buypanel: beli,
  cekpay: cekpay,
  detailpanel: detail, orderpanel: detail,
  orderspanel: orders,
  garansipanel: garansi,
  cekserver: cekserver,
  renewpanel: renew,
  cekrenew: cekrenew
}

const NAMES = Object.keys(HANDLERS)

async function handle(ctx) {
  const fn = HANDLERS[String(ctx.command || '').toLowerCase()]
  if (!fn) return
  try { return await fn(ctx) } catch (e) { return fail(ctx, e) }
}

// lanjutkan pemantauan order yang belum lunas setelah bot restart
function resume(sock) {
  for (const id of Object.keys(db.data.pending)) watch(sock, id)
}

module.exports = { NAMES, handle, resume }
