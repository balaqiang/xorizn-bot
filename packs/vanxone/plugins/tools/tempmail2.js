// .tempmail2 — email sementara (lmngh.site). Sesi tiap pengguna disimpan di bot, token tidak ditampilkan.
// Sumber ide: xDonzCode (tempmail.chat).
const axios = require('axios')
const cheerio = require('cheerio')
const { createStore } = require('../../lib/store')
const { userOf } = require('../../lib/utils')

const API = 'https://api.lmngh.site/api'
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Content-Type': 'application/json',
  Accept: 'application/json, text/plain, */*',
  Origin: 'https://lmngh.site',
  Referer: 'https://lmngh.site/'
}
const store = createStore('tempmail2', { users: {} })
const COOLDOWN = 30 * 1000
const clean = (s, n) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, n)

function htmlToText(html) {
  try {
    const $ = cheerio.load(html)
    $('script,style,head').remove()
    $('br').replaceWith('\n')
    $('p,div,tr,li,h1,h2,h3').append('\n')
    return $.root().text().replace(/[ \t]+/g, ' ').replace(/\n\s*\n\s*\n+/g, '\n\n').trim()
  } catch {
    return String(html || '').replace(/<[^>]+>/g, ' ').trim()
  }
}

function links(m) {
  const out = new Set()
  const html = String(m.html_body || '')
  for (const x of html.matchAll(/href=["']([^"']+)["']/gi)) if (/^https?:\/\//i.test(x[1])) out.add(x[1])
  for (const x of String(m.text_body || '').matchAll(/https?:\/\/[^\s<>"']+/gi)) out.add(x[0])
  return [...out]
}

// kode OTP: 4–8 digit yang berdiri sendiri, diutamakan yang dekat kata "kode/code/otp"
function otp(text) {
  const t = String(text || '')
  const near = t.match(/(?:kode|code|otp|verification|verifikasi|pin)[^\d\n]{0,40}(\d{4,8})\b/i)
  if (near) return near[1]
  const any = t.match(/(?<![\d.,])\d{6}(?![\d.,])/)
  return any ? any[0] : ''
}

async function inbox(token) {
  const { data } = await axios.get(`${API}/inbox`, { params: { token }, headers: HEADERS, timeout: 15000, validateStatus: () => true })
  if (!data?.success) throw new Error(data?.message || 'inbox gagal')
  return data
}

module.exports = {
  name: 'tempmail2',
  command: ['tempmail2', 'tmail2', 'tm2', 'emailx'],
  category: 'tools',
  emoji: '📨',
  desc: 'Email sementara #2 (lmngh): buat, cek inbox, baca isi + kode OTP',
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
        const { data } = await axios.post(`${API}/create-inbox`, {}, { headers: HEADERS, timeout: 15000, validateStatus: () => true })
        if (!data?.success || !data?.email || !data?.access_token) throw new Error('respons tidak memuat email/token')
        const exp = Date.now() + (data.expires_in || 86400) * 1000
        store.data.users[id] = { email: data.email, token: data.access_token, at: Date.now(), exp }
        store.save()
        return reply(`📧 EMAIL SEMENTARA\n\nEmail: ${data.email}\nAktif: ${((data.expires_in || 86400) / 3600).toFixed(1)} jam\n\nCek kotak masuk: ${prefix}tempmail2 inbox\nJangan dipakai untuk akun penting.`)
      } catch (err) {
        console.log('[TEMPMAIL2]', err.message)
        return reply('❌ Gagal membuat email sementara. Coba lagi nanti.')
      }
    }

    if (!mine) return reply(`Belum punya email sementara. Buat dengan ${prefix}tempmail2 baru`)
    if (mine.exp && Date.now() > mine.exp) {
      delete store.data.users[id]
      store.save()
      return reply(`⌛ Email ${mine.email} sudah kedaluwarsa. Buat yang baru: ${prefix}tempmail2 baru`)
    }

    let data
    try {
      data = await inbox(mine.token)
    } catch (err) {
      console.log('[TEMPMAIL2]', err.message)
      return reply('❌ Gagal membaca kotak masuk. Coba lagi nanti.')
    }
    const msgs = Array.isArray(data.messages) ? data.messages : []

    if (sub === 'baca' || sub === 'read') {
      const n = parseInt(args[1], 10)
      const m = msgs[n - 1]
      if (!m) return reply(`Nomor tidak valid. Lihat daftar: ${prefix}tempmail2 inbox`)
      const body = (m.text_body && String(m.text_body).trim()) || htmlToText(m.html_body) || '(tanpa isi teks)'
      const code = otp(body)
      const ls = links(m).filter((l) => !/unsubscribe|\.(png|jpe?g|gif)(\?|$)/i.test(l)).slice(0, 3)
      return reply(
        [
          `📩 #${n} ${clean(m.subject, 100) || '(tanpa subjek)'}`,
          `Dari: ${clean(m.sender_name ? `${m.sender_name} <${m.sender}>` : m.sender, 90) || '-'}`,
          code ? `Kode OTP: ${code}` : '',
          ...ls.map((l, i) => `Link ${i + 1}: ${l}`),
          '',
          body.replace(/\r/g, '').slice(0, 1500) + (body.length > 1500 ? '\n…(dipotong)' : '')
        ]
          .filter((x, i) => x !== '' || i > 3)
          .join('\n')
      )
    }

    if (!msgs.length) return reply(`📭 Kotak masuk masih kosong.\nEmail: ${mine.email}\nCek lagi beberapa detik lagi: ${prefix}tempmail2 inbox`)
    return reply(
      [
        `📬 KOTAK MASUK (${msgs.length})`,
        `Email: ${mine.email}`,
        '',
        ...msgs.slice(0, 10).map((m, i) => `${i + 1}. ${clean(m.subject, 60) || '(tanpa subjek)'}\n   ${clean(m.sender, 50) || '-'}`),
        '',
        `Baca isi: ${prefix}tempmail2 baca <no>`
      ].join('\n')
    )
  }
}
