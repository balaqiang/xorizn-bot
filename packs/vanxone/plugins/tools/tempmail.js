const axios = require('axios')
const { createStore } = require('../../lib/store')
const { userOf } = require('../../lib/utils')

const API = 'https://api.tempmail.lol/v2'
const store = createStore('tempmail', { users: {} })
const COOLDOWN = 60 * 1000
const clean = (s, n) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, n)

async function inbox(token) {
  const { data } = await axios.get(`${API}/inbox`, { params: { token }, headers: { Accept: 'application/json' }, timeout: 15000 })
  return data
}

module.exports = {
  name: 'tempmail',
  command: ['tempmail', 'emailsementara', 'tm'],
  category: 'tools',
  desc: 'Email sementara (tempmail.lol): buat, cek kotak masuk, baca isi',
  usage: 'baru | inbox | baca <no> | hapus',
  run: async ({ sender, args, prefix, reply }) => {
    const id = userOf(sender)
    const mine = store.data.users[id]
    const sub = (args[0] || '').toLowerCase()

    if (sub === 'hapus' || sub === 'delete') {
      delete store.data.users[id]
      store.save()
      return reply('🗑️ Email sementara dilupakan dari bot.')
    }

    if (sub === 'baru' || sub === 'new' || sub === 'create' || (!sub && !mine)) {
      if (mine && Date.now() - mine.at < COOLDOWN) return reply(`Tunggu ${Math.ceil((COOLDOWN - (Date.now() - mine.at)) / 1000)} detik sebelum membuat email baru.`)
      try {
        const { data } = await axios.post(`${API}/inbox/create`, {}, { headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, timeout: 15000 })
        if (!data?.address || !data?.token) throw new Error('respons tidak memuat address/token')
        store.data.users[id] = { address: data.address, token: data.token, at: Date.now() }
        store.save()
        return reply(`📧 *EMAIL SEMENTARA*\n\n${data.address}\n\nCek kotak masuk: ${prefix}tempmail inbox\nAktif ±1 jam (akun gratis). Jangan dipakai untuk akun penting.\n_Token disimpan di bot, tidak ditampilkan._`)
      } catch (err) {
        console.log('[TEMPMAIL]', err.response?.status || err.message)
        return reply('❌ Gagal membuat email sementara. Coba lagi nanti.')
      }
    }

    if (!mine) return reply(`Belum punya email sementara. Buat dengan ${prefix}tempmail baru`)

    let data
    try {
      data = await inbox(mine.token)
    } catch (err) {
      console.log('[TEMPMAIL]', err.response?.status || err.message)
      return reply('❌ Gagal membaca kotak masuk. Coba lagi nanti.')
    }
    if (data?.expired === true) {
      delete store.data.users[id]
      store.save()
      return reply(`⌛ Email ${mine.address} sudah kedaluwarsa. Buat yang baru: ${prefix}tempmail baru`)
    }
    const emails = Array.isArray(data?.emails) ? data.emails : []

    if (sub === 'baca' || sub === 'read') {
      const n = parseInt(args[1], 10)
      const m = emails[n - 1]
      if (!m) return reply(`Nomor tidak valid. Lihat daftar: ${prefix}tempmail inbox`)
      const body = String(m.body || m.text || '(tanpa isi teks)').replace(/\r/g, '').trim()
      return reply(`📩 *#${n}* ${clean(m.subject, 100) || '(tanpa subjek)'}\nDari: ${clean(m.from, 80) || '-'}\n\n${body.slice(0, 1800)}${body.length > 1800 ? '\n…(dipotong)' : ''}`)
    }

    if (!emails.length) return reply(`📭 Kotak masuk ${mine.address} masih kosong.\nCek lagi beberapa detik lagi: ${prefix}tempmail inbox`)
    await reply(
      [
        `📬 *KOTAK MASUK* (${emails.length})`,
        mine.address,
        '',
        ...emails.slice(0, 10).map((m, i) => `${i + 1}. *${clean(m.subject, 60) || '(tanpa subjek)'}*\n   ${clean(m.from, 50) || '-'}${m.date ? ` • ${new Date(m.date).toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' })}` : ''}`),
        '',
        `Baca isi: ${prefix}tempmail baca <no>`
      ].join('\n')
    )
  }
}
