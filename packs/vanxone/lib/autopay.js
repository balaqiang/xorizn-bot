// lib/autopay.js — mesin pembayaran QRIS otomatis (AutoOrder): buat tagihan, pantau status, lalu serahkan barang.
// Jenis tagihan: 'order' (pesanan toko), 'topup' (saldo bot / money), 'premium' (premium berbatas hari).
// Tagihan disimpan di database/autopay.json, jadi pemantauan lanjut sendiri setelah bot restart (lihat plugins/store/autopay-hook.js).
'use strict'
const crypto = require('crypto')
const ao = require('./autoorder')
const shop = require('./shop')
const db = require('./db')
const premx = require('./premx')
const owners = require('./owners')
const config = require('../config')
const { createStore } = require('./store')
const { card, rows, btn, jidOf } = require('./shopui')

const st = createStore('autopay', { invoices: {} })
const rp = shop.rupiah
const FINAL = new Set(['done', 'expired', 'cancelled', 'failed', 'paid_issue'])

let sockRef = null
let timer = null
let busy = false
const checking = new Set()

const attach = (sock) => { if (sock) sockRef = sock }
const get = (id) => st.data.invoices[String(id || '').toUpperCase()] || null
const list = (filter) => Object.values(st.data.invoices).filter((i) => !filter || filter(i)).sort((a, b) => b.createdAt - a.createdAt)
const pending = () => list((i) => i.status === 'pending')
const same = (a, b) => String(a || '').split('@')[0].split(':')[0] === String(b || '').split('@')[0].split(':')[0]
const prefix = () => config.prefix || '.'

const clock = (ms) => new Date(ms).toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hour12: false }).replace('.', ':') + ' WIB'
const leftText = (ms) => {
  const s = Math.max(0, Math.round((ms - Date.now()) / 1000))
  return s >= 60 ? `${Math.floor(s / 60)} menit ${s % 60} detik` : `${s} detik`
}
function parseTime(v) {
  if (v === undefined || v === null || v === '') return 0
  if (typeof v === 'number') return v < 1e12 ? v * 1000 : v
  const t = Date.parse(v)
  if (!Number.isNaN(t)) return t
  const n = Number(v)
  return Number.isFinite(n) ? (n < 1e12 ? n * 1000 : n) : 0
}

const KIND = { order: 'Pesanan toko', topup: 'Topup saldo bot', premium: 'Paket premium' }

// ---------- pengiriman pesan (aman tanpa ctx command) ----------
const ctxFor = (chat) => ({ sock: sockRef, from: chat, msg: undefined, config })
async function send(chat, { body, buttons = [], image, fallback }) {
  if (!sockRef || !chat) return
  try { await card(ctxFor(chat), { to: chat, body, buttons, image, fallback: fallback || body }) } catch (e) { console.log('[AUTOPAY] gagal kirim pesan:', e.message) }
}
async function notifyOwners(body, buttons = []) {
  for (const n of owners.fixed()) await send(jidOf(n), { body, buttons })
}

function invoiceBody(inv, { header = 'TAGIHAN QRIS', footer = '' } = {}) {
  const pay = inv.payAmount || inv.amount
  return [
    `*${header}*`,
    '',
    rows([
      ['Invoice', inv.id],
      ['Item', inv.title],
      ['Nominal', rp(inv.amount)],
      inv.fee > 0 ? ['Biaya', rp(inv.fee)] : null,
      ['Total', rp(pay)],
      ['Status', String(inv.status).toUpperCase()],
      inv.status === 'pending' ? ['Berlaku', `${clock(inv.expiresAt)} (${leftText(inv.expiresAt)} lagi)`] : null
    ].filter(Boolean)),
    footer ? `\n${footer}` : ''
  ].join('\n')
}

// kartu QR untuk dibayar (dipakai saat tagihan dibuat & saat diminta ulang)
async function sendInvoice(ctx, inv) {
  const p = prefix()
  const body = invoiceBody(inv, { footer: 'Scan QR di atas lewat aplikasi bank / e-wallet apa pun. Bayar sesuai *Total*. Pembayaran terdeteksi otomatis, tidak perlu konfirmasi manual.' })
  const buttons = [
    btn.copy('Salin kode QRIS', inv.qr),
    btn.reply('Cek status', `${p}statusbayar ${inv.id}`),
    btn.reply('Batalkan', `${p}batalbayar ${inv.id}`)
  ]
  let image = null
  try { image = await ao.qrPng(inv.qr) } catch (e) { console.log('[AUTOPAY] gagal render QR:', e.message) }
  const fallback = body + (image ? '' : `\n\nKode QRIS (tempel di aplikasi yang bisa input kode):\n${inv.qr}`) + `\n\nCek: ${p}statusbayar ${inv.id}\nBatal: ${p}batalbayar ${inv.id}`
  return card(ctx, { image, body, buttons, fallback })
}

// ---------- membuat tagihan ----------
async function create(kind, { buyer, chat, amount, title, meta = {} }) {
  if (!ao.enabled()) throw Object.assign(new Error('Pembayaran QRIS otomatis belum diaktifkan owner.'), { user: true })
  amount = Math.round(Number(amount) || 0)
  const max = Math.min(Number(ao.cfg().maxTopup) || 10000000, 10000000)
  if (amount < 300) throw Object.assign(new Error('Nominal minimal Rp300.'), { user: true })
  if (amount > max) throw Object.assign(new Error(`Nominal maksimal ${rp(max)} sekali bayar.`), { user: true })

  // tagihan order yang masih berlaku dipakai ulang (tidak membuat deposit baru)
  if (kind === 'order') {
    const old = list((i) => i.kind === 'order' && i.status === 'pending' && i.meta.orderId === meta.orderId)[0]
    if (old && old.expiresAt > Date.now() + 30000) return { inv: old, reused: true }
    if (old) await close(old, 'expired')
  }
  const limit = Number(ao.cfg().maxPending) || 3
  if (list((i) => i.status === 'pending' && same(i.buyer, buyer)).length >= limit) {
    throw Object.assign(new Error(`Kamu masih punya ${limit} tagihan yang belum dibayar. Bayar atau batalkan dulu (${prefix()}riwayatbayar).`), { user: true })
  }

  const id = 'PAY' + crypto.randomBytes(3).toString('hex').toUpperCase()
  const dep = await ao.createDeposit(amount, id)
  if (!dep || !dep.id || !dep.qr_string) throw new Error('Respon AutoOrder tidak lengkap (tanpa id / qr_string).')
  const inv = {
    id, kind, buyer, chat, amount, title,
    fee: Number(dep.fee) || 0,
    payAmount: Number(dep.payment_amount) || amount,
    depositId: String(dep.id),
    qr: String(dep.qr_string),
    status: 'pending',
    createdAt: Date.now(),
    expiresAt: parseTime(dep.expires_at) || Date.now() + 15 * 60000,
    next: Date.now() + 6000,
    last: 0,
    meta
  }
  st.data.invoices[id] = inv
  st.flush()
  start()
  return { inv, reused: false }
}

// ---------- pemantauan ----------
function schedule(inv) {
  const age = Date.now() - inv.createdAt
  inv.next = Date.now() + (age < 120000 ? 6000 : age < 600000 ? 10000 : 20000)
}

async function close(inv, status, why = '') {
  if (inv.status !== 'pending') return
  inv.status = status
  inv.closedAt = Date.now()
  st.flush()
  const text = status === 'expired' ? 'sudah kedaluwarsa' : status === 'cancelled' ? 'dibatalkan' : 'gagal diproses'
  await send(inv.buyer, { body: `*TAGIHAN ${text.toUpperCase()}*\n\n${rows([['Invoice', inv.id], ['Item', inv.title], ['Nominal', rp(inv.amount)]])}${why ? `\n\n${why}` : ''}\n\nBuat tagihan baru bila masih mau membayar.` })
}

async function check(inv, { force = false } = {}) {
  if (!inv || inv.status !== 'pending' || checking.has(inv.id)) return inv
  if (force && Date.now() - (inv.last || 0) < 5500) return inv // batas API: 1 cek / 5 detik / transaksi
  checking.add(inv.id)
  try {
    inv.last = Date.now()
    const d = await ao.getDeposit(inv.depositId)
    const s = String(d?.status || '').toLowerCase()
    inv.misses = 0
    if (s === 'paid') await settle(inv)
    else if (s === 'expired' || s === 'cancelled') await close(inv, s)
    else if (Date.now() > inv.expiresAt + 120000) await close(inv, 'expired')
    else schedule(inv)
  } catch (e) {
    if (e.status === 429) inv.next = Date.now() + Math.max(5, e.retryAfter || 5) * 1000
    else if (e.status === 404 || e.code === 'DEPOSIT_NOT_FOUND') {
      inv.misses = (inv.misses || 0) + 1
      if (inv.misses >= 5) await close(inv, 'failed', 'Transaksi tidak ditemukan di AutoOrder.')
      else inv.next = Date.now() + 15000
    } else {
      console.log('[AUTOPAY] cek gagal', inv.id, e.message)
      inv.next = Date.now() + 20000
      if (Date.now() > inv.expiresAt + 15 * 60000) await close(inv, 'expired')
    }
    st.save()
  } finally {
    checking.delete(inv.id)
  }
  return inv
}

async function tick() {
  if (busy || !sockRef || !ao.enabled()) return
  busy = true
  try {
    const now = Date.now()
    for (const inv of pending().filter((i) => (i.next || 0) <= now).slice(0, 8)) await check(inv)
  } catch (e) { console.log('[AUTOPAY] tick', e.message) } finally { busy = false }
}
function start() {
  if (timer) return
  timer = setInterval(tick, 3000)
  if (timer.unref) timer.unref()
}

async function cancel(inv) {
  if (!inv || inv.status !== 'pending') throw Object.assign(new Error('Tagihan ini sudah tidak aktif.'), { user: true })
  try {
    await ao.cancelDeposit(inv.depositId)
  } catch (e) {
    // mungkin sudah dibayar / sudah kedaluwarsa: cek status asli dulu
    const d = await ao.getDeposit(inv.depositId).catch(() => null)
    const s = String(d?.status || '').toLowerCase()
    if (s === 'paid') { await settle(inv); throw Object.assign(new Error('Tagihan ini ternyata sudah dibayar, jadi tidak bisa dibatalkan.'), { user: true }) }
    if (s !== 'expired' && s !== 'cancelled') throw e
  }
  await close(inv, 'cancelled')
  return inv
}

// ---------- pembayaran masuk -> serahkan barang ----------
async function settle(inv) {
  if (inv.status !== 'pending') return
  inv.status = 'paid' // ditandai & disimpan SEBELUM kirim barang supaya tidak pernah terkirim dobel
  inv.paidAt = Date.now()
  st.flush()
  try {
    if (inv.kind === 'order') await fulfillOrder(inv)
    else if (inv.kind === 'topup') await fulfillTopup(inv)
    else if (inv.kind === 'premium') await fulfillPremium(inv)
    else throw new Error('jenis tagihan tidak dikenal: ' + inv.kind)
    if (inv.status === 'paid') inv.status = 'done'
  } catch (e) {
    console.log('[AUTOPAY] gagal menyerahkan', inv.id, e.message)
    inv.status = 'paid_issue'
    inv.note = e.message
    await send(inv.buyer, { body: `*PEMBAYARAN DITERIMA*\n\nPembayaran ${inv.id} (${rp(inv.amount)}) sudah masuk, tapi pesanan belum bisa diproses otomatis. Owner sudah diberi tahu, mohon tunggu.` })
    await notifyOwners(`*PERLU TINDAKAN*\n\nPembayaran QRIS masuk tetapi gagal diproses otomatis.\n\n${rows([['Invoice', inv.id], ['Jenis', KIND[inv.kind] || inv.kind], ['Item', inv.title], ['Nominal', rp(inv.amount)], ['Pembeli', '@' + String(inv.buyer).split('@')[0]], ['Sebab', e.message]])}`)
  }
  st.flush()
}

async function fulfillOrder(inv) {
  const o = shop.getOrder(inv.meta.orderId)
  if (!o) throw new Error('order ' + inv.meta.orderId + ' tidak ditemukan')
  if (o.status === 'done' || o.status === 'rejected') throw new Error(`order ${o.id} sudah ${o.status === 'done' ? 'selesai' : 'ditolak'} sebelum pembayaran masuk (kemungkinan bayar dobel)`)
  const p = shop.getProduct(o.product)
  if (p && p.stock >= 0 && p.stock < o.qty) throw new Error(`stok ${p.name} kurang (${p.stock}) padahal sudah dibayar`)
  if (p && p.stock >= 0) p.stock -= o.qty
  if (p) p.sold += o.qty
  o.status = 'done'
  o.paidVia = 'qris-auto'
  o.payRef = inv.id
  shop.st.flush()

  const hasContent = !!(p && p.content)
  const out = ['*PEMBAYARAN DITERIMA*', '', rows([['Order', o.id], ['Produk', o.name], ['Jumlah', o.qty], ['Total', rp(inv.amount)]]), '', hasContent ? 'Data pesananmu dikirim di pesan berikutnya.' : 'Pesanan akan diproses owner secepatnya.', '', 'Terima kasih sudah berbelanja.'].join('\n')
  await send(inv.buyer, { body: out, buttons: hasContent ? [btn.copy('Salin pesanan', p.content.slice(0, 1000))] : [] })
  // isi pesanan dikirim mentah (tanpa pemformat gaya bot) supaya akun/link/password tidak berubah bentuk
  if (hasContent) await (sockRef.__rawSend || sockRef.sendMessage)(inv.buyer, { text: p.content }).catch((e) => console.log('[AUTOPAY] gagal kirim isi pesanan:', e.message))
  if (inv.chat && inv.chat !== inv.buyer && String(inv.chat).endsWith('@g.us')) await send(inv.chat, { body: `Pembayaran ${inv.id} diterima, pesanan ${o.id} sudah dikirim ke chat pribadi pembeli.` })
  await notifyOwners(`*ORDER LUNAS (QRIS OTOMATIS)*\n\n${rows([['Order', o.id], ['Produk', o.name], ['Jumlah', o.qty], ['Total', rp(inv.amount)], ['Pembeli', '@' + String(o.buyer).split('@')[0]], ['Isi otomatis', hasContent ? 'terkirim' : 'KOSONG, kirim manual']])}`)
}

async function fulfillTopup(inv) {
  const u = db.getUser(inv.buyer)
  u.money += inv.meta.money
  db.save()
  await send(inv.buyer, { body: `*TOPUP BERHASIL*\n\n${rows([['Invoice', inv.id], ['Bayar', rp(inv.amount)], ['Saldo masuk', Number(inv.meta.money).toLocaleString('id-ID')], ['Saldo kini', Number(u.money).toLocaleString('id-ID')]])}\n\nTerima kasih.` })
  await notifyOwners(`*TOPUP MASUK*\n\n${rows([['Invoice', inv.id], ['Bayar', rp(inv.amount)], ['Pembeli', '@' + String(inv.buyer).split('@')[0]]])}`)
}

async function fulfillPremium(inv) {
  const until = premx.give(inv.buyer, inv.meta.days)
  await send(inv.buyer, { body: `*PREMIUM AKTIF*\n\n${rows([['Invoice', inv.id], ['Paket', `${inv.meta.days} hari`], ['Bayar', rp(inv.amount)], ['Sisa', premx.fmt(until - Date.now())]])}\n\nTerima kasih, selamat menikmati fitur premium.` })
  await notifyOwners(`*PREMIUM TERJUAL*\n\n${rows([['Invoice', inv.id], ['Paket', `${inv.meta.days} hari`], ['Bayar', rp(inv.amount)], ['Pembeli', '@' + String(inv.buyer).split('@')[0]]])}`)
}

// pemantauan tagihan yang tertinggal saat bot mati: cek semua sekarang, lalu lanjut berkala
function resume(sock) {
  attach(sock)
  for (const i of pending()) i.next = 0
  start()
  tick()
}

module.exports = { st, KIND, FINAL, attach, resume, start, get, list, pending, create, check, cancel, settle, sendInvoice, invoiceBody, clock, leftText, same }
