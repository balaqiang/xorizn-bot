// lib/aonokos.js — jual nomor virtual OTP (Nokos) lewat AutoOrder. Pembeli bayar pakai saldo bot (money); modal diambil dari saldo AutoOrder owner.
// Pesanan dipantau otomatis: OTP masuk -> dikirim ke pembeli; gagal / kedaluwarsa / dibatalkan -> saldo pembeli dikembalikan sekali saja.
'use strict'
const ao = require('./autoorder')
const db = require('./db')
const shop = require('./shop')
const config = require('../config')
const { createStore } = require('./store')
const { card, rows, btn } = require('./shopui')

const st = createStore('aonokos', { orders: {} })
const rp = shop.rupiah
const num = (n) => Number(n).toLocaleString('id-ID')
const same = (a, b) => String(a || '').split('@')[0].split(':')[0] === String(b || '').split('@')[0].split(':')[0]
const prefix = () => config.prefix || '.'
const BAD = new Set(['cancelled', 'canceled', 'expired', 'failed', 'refunded', 'error', 'rejected'])

let sockRef = null
let timer = null
let busy = false
const checking = new Set()

const attach = (sock) => { if (sock) sockRef = sock }
const enabled = () => ao.enabled() && ao.cfg().nokos !== false
const get = (id) => {
  const k = String(id || '').toUpperCase()
  return Object.values(st.data.orders).find((o) => o.orderId.toUpperCase() === k || o.apiId === id) || null
}
const list = (f) => Object.values(st.data.orders).filter((o) => !f || f(o)).sort((a, b) => b.createdAt - a.createdAt)

// harga jual dalam saldo bot dari harga API (Rp)
function sellPrice(apiPrice) {
  const m = ao.cfg().nokosMarkup || {}
  const rate = Number(ao.cfg().topupRate) || 1
  const rupiah = Number(apiPrice) * (1 + (Number(m.percent) || 0) / 100) + (Number(m.flat) || 0)
  const up = (x) => Math.ceil(Number(x.toFixed(6))) // buang sisa floating point (1500 x 1.1 = 1650.0000000000002) sebelum dibulatkan ke atas
  return { rupiah: up(rupiah), money: up(rupiah * rate) }
}

async function send(chat, body, buttons = []) {
  if (!sockRef || !chat) return
  try { await card({ sock: sockRef, from: chat, msg: undefined, config }, { to: chat, body, buttons, fallback: body }) } catch (e) { console.log('[NOKOS] gagal kirim:', e.message) }
}

// pilih penawaran: offer=<id> persis, atau yang tersedia & termurah sesuai tier/country
async function pickOffer(productId, { tier, country, offerId } = {}) {
  const offers = await ao.nokosOffers(productId, { tier, country })
  const arr = Array.isArray(offers) ? offers : []
  if (offerId) return arr.find((o) => String(o.id) === String(offerId)) || null
  return arr.filter((o) => o.available === undefined || Number(o.available) > 0).sort((a, b) => Number(a.price) - Number(b.price))[0] || null
}

async function buy({ buyer, chat, productId, tier, country, offerId, free = false, serviceName = '' }) {
  const offer = await pickOffer(productId, { tier, country, offerId })
  if (!offer) throw Object.assign(new Error('Penawaran tidak tersedia untuk pilihan itu. Cek dulu dengan ' + prefix() + 'nokosharga ' + productId), { user: true })
  const price = sellPrice(offer.price)
  const user = db.getUser(buyer)
  const cost = free ? 0 : price.money
  if (user.money < cost) throw Object.assign(new Error(`Saldo kurang. Harga ${num(cost)}, saldomu ${num(user.money)}. Isi dulu dengan ${prefix()}topup.`), { user: true })
  user.money -= cost // dipotong dulu supaya tidak bisa dipakai dobel; dikembalikan kalau order gagal
  db.save()
  let r
  try {
    r = await ao.nokosOrder({ productId, offerId: offer.id })
  } catch (e) {
    user.money += cost
    db.save()
    throw e
  }
  const apiId = String(r.id || r.orderId)
  const o = {
    apiId, orderId: String(r.orderId || r.id), buyer, chat, productId,
    service: r.serviceName || serviceName || productId,
    country: r.countryName || offer.countryName || country || '',
    tier: r.tierLabel || offer.tierLabel || tier || '',
    phone: r.phoneNumber || '', raw: r.rawPhoneNumber || '',
    apiPrice: Number(r.price ?? offer.price) || 0, charged: cost,
    status: 'pending', refunded: false,
    createdAt: Date.now(),
    expiresAt: Date.parse(r.expiresAt) || Date.now() + 20 * 60000,
    cancelAt: Date.parse(r.cancelAvailableAt) || 0,
    next: Date.now() + 6000
  }
  st.data.orders[apiId] = o
  st.flush()
  start()
  return o
}

function refund(o, why) {
  if (o.refunded || !o.charged) { o.refunded = true; return 0 }
  const u = db.getUser(o.buyer)
  u.money += o.charged
  db.save()
  o.refunded = true
  return o.charged
}

async function finish(o, status, text) {
  if (o.status !== 'pending') return
  o.status = status
  const back = BAD.has(status) ? refund(o) : 0
  st.flush()
  await send(o.buyer, [text, back ? `\nSaldo ${num(back)} sudah dikembalikan.` : ''].join(''))
}

const orderBody = (o, head) => `*${head}*\n\n${rows([['Order', o.orderId], ['Layanan', o.service], ['Negara', o.country], ['Paket', o.tier], ['Nomor', o.phone || '-'], ['Harga', o.charged ? num(o.charged) + ' saldo' : 'gratis'], ['Status', String(o.status).toUpperCase()]])}`

async function check(o) {
  if (!o || o.status !== 'pending' || checking.has(o.apiId)) return o
  checking.add(o.apiId)
  try {
    const r = await ao.nokosGet(o.apiId)
    const s = String(r.status || '').toLowerCase()
    if (r.phoneNumber && !o.phone) o.phone = r.phoneNumber
    if (s === 'completed' || r.otpCode) {
      o.status = 'done'
      o.otp = String(r.otpCode || '')
      st.flush()
      await send(o.buyer, `${orderBody(o, 'OTP MASUK')}\n\n${rows([['Kode OTP', o.otp || '-']])}${r.otpMessage ? `\n\nPesan:\n${r.otpMessage}` : ''}`, o.otp ? [btn.copy('Salin OTP', o.otp)] : [])
    } else if (BAD.has(s)) {
      await finish(o, s === 'canceled' ? 'cancelled' : s, orderBody(o, 'PESANAN ' + (s === 'expired' ? 'KEDALUWARSA' : 'DIBATALKAN')))
    } else if (Date.now() > o.expiresAt + 90000) {
      // lewat batas waktu tanpa SMS: batalkan di API (refund modal) lalu kembalikan saldo pembeli
      await ao.nokosCancel(o.apiId).catch(() => {})
      await finish(o, 'expired', orderBody(o, 'PESANAN KEDALUWARSA') + '\n\nSMS tidak masuk sampai batas waktu.')
    } else o.next = Date.now() + 6000
  } catch (e) {
    if (e.status === 429) o.next = Date.now() + Math.max(5, e.retryAfter || 5) * 1000
    else {
      o.misses = (o.misses || 0) + (e.status === 404 ? 1 : 0)
      o.next = Date.now() + 15000
      if (o.misses >= 5) await finish(o, 'failed', orderBody(o, 'PESANAN GAGAL') + '\n\nPesanan tidak ditemukan di penyedia.')
      else if (Date.now() > o.expiresAt + 15 * 60000) await finish(o, 'expired', orderBody(o, 'PESANAN KEDALUWARSA'))
    }
    st.save()
  } finally { checking.delete(o.apiId) }
  return o
}

async function cancel(o) {
  if (!o || o.status !== 'pending') throw Object.assign(new Error('Pesanan ini sudah tidak aktif.'), { user: true })
  if (o.cancelAt && Date.now() < o.cancelAt) throw Object.assign(new Error(`Belum bisa dibatalkan. Coba lagi ${Math.ceil((o.cancelAt - Date.now()) / 1000)} detik lagi (masa tunggu pembatalan).`), { user: true })
  await ao.nokosCancel(o.apiId) // gagal (mis. SMS sudah masuk) -> error diteruskan, saldo tidak dikembalikan
  await finish(o, 'cancelled', orderBody(o, 'PESANAN DIBATALKAN'))
  return o
}

async function tick() {
  if (busy || !sockRef || !enabled()) return
  busy = true
  try {
    const now = Date.now()
    for (const o of list((x) => x.status === 'pending' && (x.next || 0) <= now).slice(0, 6)) await check(o)
  } catch (e) { console.log('[NOKOS] tick', e.message) } finally { busy = false }
}
function start() {
  if (timer) return
  timer = setInterval(tick, 3000)
  if (timer.unref) timer.unref()
}
function resume(sock) {
  attach(sock)
  for (const o of list((x) => x.status === 'pending')) o.next = 0
  start()
  tick()
}

module.exports = { st, attach, enabled, resume, start, get, list, buy, check, cancel, sellPrice, orderBody, same, num }
