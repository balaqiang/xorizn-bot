// lib/shop.js — data & helper toko xorizn-bot: metode pembayaran (qris/dana/ovo/gopay), produk, dan order.
// Dipakai oleh plugins/store/*.js. Data tersimpan di database/shop.json, gambar QRIS di database/pay/.
'use strict'
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { createStore } = require('./store')

const st = createStore('shop', { pay: {}, products: {}, orders: {}, seq: { product: 0 } })
const payDir = path.join(__dirname, '..', 'database', 'pay')

// metode yang didukung: qris + 3 e-wallet (nomor + atas nama)
const METHODS = {
  qris: { label: 'QRIS', type: 'image' },
  dana: { label: 'DANA', type: 'number' },
  ovo: { label: 'OVO', type: 'number' },
  gopay: { label: 'GoPay', type: 'number' }
}
const ALIAS = { gopai: 'gopay', gp: 'gopay', go: 'gopay', qr: 'qris', qriss: 'qris' }
const method = (m) => {
  const k = String(m || '').toLowerCase().replace(/[^a-z]/g, '')
  const key = ALIAS[k] || k
  return METHODS[key] ? key : ''
}

const rupiah = (n) => 'Rp' + Math.round(Number(n) || 0).toLocaleString('id-ID')
const clean = (s) => String(s || '').replace(/\s+/g, ' ').trim()

// ---------- pembayaran ----------
function setNumber(key, number, name) {
  st.data.pay[key] = { number: String(number).replace(/[^\d]/g, ''), name: clean(name), at: Date.now() }
  st.save()
  return st.data.pay[key]
}
function setQris(buffer, note = '') {
  fs.mkdirSync(payDir, { recursive: true })
  const file = path.join(payDir, 'qris.jpg')
  fs.writeFileSync(file, buffer)
  st.data.pay.qris = { file: 'qris.jpg', note: clean(note), at: Date.now() }
  st.save()
  return st.data.pay.qris
}
function delPay(key) {
  const cur = st.data.pay[key]
  if (!cur) return false
  if (key === 'qris') { try { fs.unlinkSync(path.join(payDir, cur.file || 'qris.jpg')) } catch {} }
  delete st.data.pay[key]
  st.save()
  return true
}
const getPay = (key) => st.data.pay[key] || null
const listPay = () => Object.keys(METHODS).filter((k) => st.data.pay[k])
const qrisBuffer = () => {
  const cur = st.data.pay.qris
  if (!cur) return null
  try { return fs.readFileSync(path.join(payDir, cur.file || 'qris.jpg')) } catch { return null }
}

// ---------- produk ----------
function addProduct({ name, price, desc = '', stock = -1, content = '', image = null }) {
  const id = String(++st.data.seq.product)
  let img = ''
  if (image) {
    fs.mkdirSync(payDir, { recursive: true })
    img = `produk-${id}.jpg`
    fs.writeFileSync(path.join(payDir, img), image)
  }
  st.data.products[id] = { id, name: clean(name), price: Math.max(0, Math.round(Number(price) || 0)), desc: String(desc || '').trim(), stock: Number.isFinite(Number(stock)) ? Number(stock) : -1, content: String(content || ''), image: img, sold: 0, at: Date.now() }
  st.save()
  return st.data.products[id]
}
function delProduct(id) {
  const p = st.data.products[id]
  if (!p) return false
  if (p.image) { try { fs.unlinkSync(path.join(payDir, p.image)) } catch {} }
  delete st.data.products[id]
  st.save()
  return true
}
const getProduct = (id) => st.data.products[String(id).replace(/[^\d]/g, '')] || null
const listProducts = () => Object.values(st.data.products)
const productImage = (p) => { try { return p?.image ? fs.readFileSync(path.join(payDir, p.image)) : null } catch { return null } }
const stockText = (p) => (p.stock < 0 ? 'Tersedia' : p.stock === 0 ? 'Habis' : `${p.stock}`)

// ---------- order ----------
function newOrderId() {
  let id
  do { id = 'INV' + crypto.randomBytes(3).toString('hex').toUpperCase() } while (st.data.orders[id])
  return id
}
function createOrder({ buyer, chat, product, qty = 1 }) {
  const id = newOrderId()
  // kode unik 1-99 supaya nominal mudah dicocokkan di mutasi
  const unique = 1 + crypto.randomInt(99)
  const total = product.price * qty + unique
  st.data.orders[id] = { id, buyer, chat, product: product.id, name: product.name, qty, price: product.price, unique, total, status: 'pending', at: Date.now() }
  st.save()
  return st.data.orders[id]
}
const getOrder = (id) => st.data.orders[String(id || '').toUpperCase()] || null
const listOrders = (status) => Object.values(st.data.orders).filter((o) => !status || o.status === status).sort((a, b) => b.at - a.at)

module.exports = { st, METHODS, method, rupiah, clean, setNumber, setQris, delPay, getPay, listPay, qrisBuffer, addProduct, delProduct, getProduct, listProducts, productImage, stockText, createOrder, getOrder, listOrders }
