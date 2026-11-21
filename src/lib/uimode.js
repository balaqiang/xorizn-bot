// =====================================================================
//  lib/uimode.js — pilihan TAMPILAN bot (tersimpan, bisa diganti lewat chat tanpa restart)
//
//    text : balasan teks biasa (menu & tombol memakai pengirim xorizn-bot)
//    rich : UI kartu HTML (menu interaktif, semua balasan jadi kartu + tombol Salin)
//
//  Nilai awal dari settings.js (global.uiMode). Setelah owner memakai `.uimode`, pilihannya tersimpan
//  di database/uimode.json dan menang atas settings.js.
// =====================================================================
'use strict'

const { createStore } = require('./store')

const store = createStore('uimode', { mode: '' })

const ALIAS = {
  text: 'text', biasa: 'text', asli: 'text', classic: 'text', lama: 'text', polos: 'text', zerotwo: 'text',
  rich: 'rich', ui: 'rich', html: 'rich', baru: 'rich', kartu: 'rich', card: 'rich'
}
const normalize = (v) => ALIAS[String(v || '').trim().toLowerCase()] || ''

const get = () => normalize(store.data.mode) || normalize(global.uiMode) || 'rich'
const isRich = () => get() === 'rich'

function set(v) {
  const m = normalize(v)
  if (!m) return null
  store.data.mode = m
  store.flush()
  return m
}

module.exports = { get, set, isRich, normalize }
