/** Helper kecil yang dipakai plugin native. */
import fs from 'node:fs'
import path from 'node:path'
import bot from '../core/bot.js'
import { participantMatches, toPnJid, digits, userPart } from '../core/jid.js'

export const readMore = String.fromCharCode(8206).repeat(4001)

export function runtime(ms) {
  const s = Math.floor(ms / 1000)
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const mnt = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return [d && `${d} hari`, h && `${h} jam`, mnt && `${mnt} menit`, `${sec} detik`].filter(Boolean).join(' ')
}

export function bytes(n) {
  if (!n) return '0 B'
  const u = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(n) / Math.log(1024))
  return `${(n / 1024 ** i).toFixed(i ? 1 : 0)} ${u[i]}`
}

export function now(tz) {
  return new Date().toLocaleString('id-ID', { timeZone: tz || bot.settings.timezone || 'Asia/Jakarta', dateStyle: 'full', timeStyle: 'short' })
}

export function greeting(tz) {
  const h = Number(new Date().toLocaleString('en-US', { timeZone: tz || bot.settings.timezone || 'Asia/Jakarta', hour: 'numeric', hour12: false }))
  if (h < 4) return 'Selamat malam 🌙'
  if (h < 11) return 'Selamat pagi ☀️'
  if (h < 15) return 'Selamat siang 🌤️'
  if (h < 18) return 'Selamat sore 🌇'
  return 'Selamat malam 🌙'
}

let thumb = null
export function thumbnail() {
  if (thumb) return thumb
  const file = path.join(bot.config.paths.assets, 'images', 'thumbnail.jpg')
  thumb = fs.existsSync(file) ? fs.readFileSync(file) : null
  return thumb
}

/** Konteks "iklan" kecil (judul + thumbnail) untuk pesan menu/info. */
export function adReply(title, body) {
  const t = thumbnail()
  return {
    externalAdReply: {
      title: title || bot.settings.botName,
      body: body || bot.settings.footer,
      thumbnail: t || undefined,
      mediaType: 1,
      renderLargerThumbnail: false,
      sourceUrl: ''
    }
  }
}

/** Target dari mention / reply / nomor di teks. Mengembalikan jid PN atau ''. */
export function getTarget(m, text = '') {
  if (m.mentionedJid?.length) return m.mentionedJid[0]
  if (m.quoted?.sender) return m.quoted.sender
  // ambil SATU token nomor (bukan semua angka di teks, supaya "62812xxx 30d" tidak tergabung)
  const token = String(text || '').split(/\s+/).find((w) => /^@?\+?[\d()-]{8,20}$/.test(w) && digits(w).length >= 8)
  if (!token) return ''
  let d = digits(token)
  if (d.startsWith('0')) d = `62${d.slice(1)}` // format lokal 08xx → 628xx
  return d.length >= 8 && d.length <= 16 ? toPnJid(d) : ''
}

/** Cari id participant sebagaimana dikenal grup (bisa LID) untuk dipakai di groupParticipantsUpdate. */
export function participantIdFor(participants, jid) {
  const p = (participants || []).find((x) => participantMatches(x, [jid]))
  return p?.id || jid
}

export const mention = (jid) => `@${userPart(jid)}`

export function onOff(arg) {
  const a = String(arg || '').toLowerCase()
  if (['on', 'aktif', '1', 'enable', 'true', 'nyala'].includes(a)) return true
  if (['off', 'mati', '0', 'disable', 'false', 'nonaktif'].includes(a)) return false
  return null
}

export function dashboardUrl() {
  const { host, port } = bot.config.dashboard
  return `http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`
}
