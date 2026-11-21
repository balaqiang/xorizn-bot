// lib/zt.js — helper kecil untuk fitur hasil porting xorizn-bot (download, stalker, owner)
// Ringan: tanpa dependensi baru, memakai lib bawaan xorizn-bot (downloader, richui, safeurl).
'use strict'

const dl = require('../downloader')
const { getQuotedText } = require('../utils')

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

// teks dari argumen, atau dari pesan yang di-reply
const input = (msg, args) => args.join(' ').trim() || String(getQuotedText(msg) || '').trim()
const match = (s, re) => (String(s || '').match(re) || [])[0] || null
const n = (v) => Number(v || 0).toLocaleString('id-ID')
const clean = (s) => String(s || '').replace(/[\\/:*?"<>|\n\r]+/g, ' ').trim().slice(0, 80)
const bytes = (b) => {
  if (!b) return '-'
  const u = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(3, Math.floor(Math.log(b) / Math.log(1024)))
  return `${(b / 1024 ** i).toFixed(i ? 2 : 0)} ${u[i]}`
}

// keterangan media bergaya xorizn-bot: judul + ikon platform, garis, baris "emoji *Label* : nilai", footer
const ROW_ICON = [
  [/^judul|^title|^nama( file| lagu)?$/i, '📝'], [/uploader|author|artis|channel|pembuat|creator|owner/i, '👤'], [/view|tonton|putar|play/i, '👁️'],
  [/like|suka/i, '❤️'], [/komen|comment/i, '💬'], [/share|bagikan/i, '🔁'], [/simpan|favorit|save/i, '🔖'], [/durasi|duration/i, '⏱️'],
  [/ukuran|size/i, '📦'], [/kualitas|resolusi|quality/i, '🎞️'], [/sumber|link|url|source/i, '🔗'], [/tipe|jenis|type|media/i, '🏷️'],
  [/total|jumlah|item/i, '🖼️'], [/ekstensi|format/i, '🧩'], [/repo|folder/i, '📁'], [/^id$/i, '🆔'], [/wilayah|region|negara/i, '🌍'],
  [/tanggal|upload|rilis|dibuat|waktu/i, '📅'], [/musik|sound|lagu|audio/i, '🎵'], [/deskripsi|bio|caption/i, '📄']
]
const TITLE_ICON = [
  [/tiktok|douyin/i, '🎵'], [/instagram|reels/i, '📸'], [/youtube/i, '▶️'], [/facebook/i, '📘'], [/twitter|x\b/i, '🐦'], [/pinterest/i, '📌'],
  [/spotify/i, '🎧'], [/drive/i, '☁️'], [/github|git/i, '🐙'], [/mediafire|sfile/i, '📁'], [/audio|mp3|soundcloud/i, '🎶'], [/video|videy/i, '🎬']
]
const pickIcon = (list, key, fb) => (list.find(([re]) => re.test(key)) || [, fb])[1]

function caption(title, rows = []) {
  const { card, LINE } = require('../fmt')
  const clean = rows.filter((r) => r && r[1] !== undefined && r[1] !== null && r[1] !== '' && r[1] !== '-')
  return card({
    icon: pickIcon(TITLE_ICON, title, '📥'),
    title,
    rows: clean.map(([k, v]) => [k, v, require('../fmt').rowIcon(k)])
  })
}

// unduh lalu kirim (memakai batas ukuran & mode dokumen >16 MB milik bot)
async function sendUrl(sock, from, msg, url, { kind, filename, caption: cap, mime, headers } = {}) {
  const got = await dl.fetchBuffer(url, headers)
  if (got.buffer.length < 1000) throw new Error('file terlalu kecil, kemungkinan bukan media')
  return dl.sendBuffer(sock, from, msg, got.buffer, kind || dl.kindOf(got.mime, filename), { filename, caption: cap, mime })
}

async function sendDoc(sock, from, msg, url, { filename, mime, caption: cap, headers }) {
  const got = await dl.fetchBuffer(url, headers)
  return sock.sendMessage(from, { document: got.buffer, fileName: filename, mimetype: mime || got.mime || 'application/octet-stream', caption: cap }, { quoted: msg })
}

// kartu profil (stalker): mode rich = kartu HTML, mode button = foto + keterangan
async function profileCard(sock, from, msg, { icon, eyebrow, name, sub, photo, rows, text, chips, copy }) {
  const richui = require('../richui')
  const { fetchPublic } = require('../safeurl')
  let buf = null
  if (photo) {
    try {
      const r = await fetchPublic(photo, { maxBytes: 5 * 1024 * 1024, timeout: 20000 })
      if (/^image\//i.test(r.contentType)) buf = r.buffer
    } catch {}
  }
  const list = rows.filter(([, v]) => v !== undefined && v !== null && v !== '')
  const cap = [`${icon} ${eyebrow.toUpperCase()}`, name, ...list.map(([k, v]) => `${k}: ${v}`), text ? `\n${text}` : ''].join('\n')
  return richui.sendEntity(
    sock,
    from,
    { icon, eyebrow, name, sub, avatar: buf ? await richui.avatarUri(buf) : '', chips: chips || [], text: text || '', rows: list.map(([k, v]) => ({ k, v: String(v) })) },
    { quoted: msg, buffer: buf, caption: cap, copy }
  )
}

module.exports = { UA, input, match, n, clean, bytes, caption, sendUrl, sendDoc, profileCard }
