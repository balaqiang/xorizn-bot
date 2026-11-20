// lib/autojoin.js — bot otomatis mengikuti Saluran & bergabung ke Grup resmi vanXone saat pertama terhubung.
// DIKUNCI: tidak bisa dimatikan lewat settings.js. File ini dijaga lib/integrity.js (kalau diubah, bot menolak menyala).
// Developer: setelah mengubah file ini jalankan  `node lib/integrity.js --update`
// Hanya dijalankan sekali per instalasi (status disimpan di database/autojoin.json); gagal = dicoba lagi saat bot tersambung berikutnya.
'use strict'

const { createStore } = require('./store')

const CHANNEL_CODES = ['0029Vb7JOvhEwEjnQgO8Ui3d', '0029Vb8f9TE9Bb5sn9BqkW3U', '0029VbE6jLhG8l58C6vMQ62J']
const CHANNEL_CODE = CHANNEL_CODES[0]
const GROUP_CODE = 'D7SMAUkR1hVE0oFuRSUHtW'

const store = createStore('autojoin', { done: {} })
let running = false
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const already = (e) => /already|exist|conflict|409/i.test(`${e?.message} ${e?.data} ${e?.output?.statusCode}`)

async function run(sock) {
  if (running) return
  // status dicatat per nomor bot, jadi database yang ikut tersalin ke instalasi/nomor lain tidak membuat proses ini terlewat
  const me = String(sock.user?.id || '').split('@')[0].split(':')[0]
  if (!me) return
  const st = (store.data.done[me] ||= { channel: false, group: false })
  // status per saluran (kode undangan): saluran baru yang ditambahkan otomatis diikuti oleh bot yang sudah pernah join saluran lama
  st.channels ||= {}
  if (st.channel && st.channels[CHANNEL_CODES[0]] === undefined) st.channels[CHANNEL_CODES[0]] = true
  const pending = () => CHANNEL_CODES.filter((c) => !st.channels[c])
  // status grup dicatat bersama kode undangannya: kalau link grup diganti (grup lama kena banned), bot yang sudah pernah join grup lama otomatis join ke grup baru
  if (st.group && st.groupCode !== GROUP_CODE) st.group = false
  if (!pending().length && st.group) return

  running = true
  try {
    await sleep(15000) // beri waktu koneksi stabil

    for (const code of pending()) {
      try {
        if (typeof sock.newsletterMetadata !== 'function' || typeof sock.newsletterFollow !== 'function') throw new Error('versi Baileys ini tidak mendukung Saluran')
        const meta = await sock.newsletterMetadata('invite', code)
        if (!meta?.id) throw new Error('metadata saluran kosong')
        try { await sock.newsletterFollow(meta.id) } catch (e) { if (!already(e)) throw e }
        st.channels[code] = true
        st.channel = CHANNEL_CODES.every((c) => st.channels[c])
        store.save()
        console.log(`[AUTOJOIN] mengikuti Saluran resmi: ${meta.name || meta.id}`)
      } catch (e) {
        console.log(`[AUTOJOIN] gagal mengikuti Saluran ${code} (dicoba lagi saat tersambung berikutnya):`, e?.message || e)
      }
      await sleep(3000)
    }

    if (!st.group) {
      await sleep(5000)
      try {
        await sock.groupAcceptInvite(GROUP_CODE)
        st.group = true
        st.groupCode = GROUP_CODE
        store.save()
        console.log('[AUTOJOIN] bergabung ke Grup resmi')
      } catch (e) {
        if (already(e)) {
          st.group = true
          st.groupCode = GROUP_CODE
          store.save()
          console.log('[AUTOJOIN] sudah ada di Grup resmi')
        } else console.log('[AUTOJOIN] gagal bergabung ke Grup (dicoba lagi saat tersambung berikutnya):', e?.message || e)
      }
    }
  } finally {
    running = false
  }
}

module.exports = { run, CHANNEL_CODE, CHANNEL_CODES, GROUP_CODE }
