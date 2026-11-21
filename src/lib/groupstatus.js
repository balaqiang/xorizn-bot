// lib/groupstatus.js — inti fitur Status Grup (dipakai .swgc dan .swgcall)
// Mendukung: teks berwarna/font, gambar, video (>60 dtk dipotong per segmen), stiker, audio -> VN, dokumen media, link media.
'use strict'

const crypto = require('crypto')
const baileys = require('@whiskeysockets/baileys')
const { getMedia, getQuotedText } = require('./utils')
const { fetchPublic } = require('./safeurl')
const ffm = require('./ffm')

const COLORS = {
  biru: '#34B7F1', blue: '#34B7F1', hijau: '#25D366', green: '#25D366', kuning: '#FFD700', yellow: '#FFD700',
  jingga: '#FF8C00', orange: '#FF8C00', merah: '#FF3B30', red: '#FF3B30', ungu: '#9C27B0', purple: '#9C27B0',
  pink: '#E91E63', merahmuda: '#E91E63', cyan: '#00BCD4', tosca: '#009688', teal: '#009688', cokelat: '#795548',
  brown: '#795548', abu: '#9E9E9E', gray: '#9E9E9E', grey: '#9E9E9E', hitam: '#1E1E2D', black: '#1E1E2D',
  putih: '#FFFFFF', white: '#FFFFFF', navy: '#0F172A', maroon: '#800000', lime: '#84CC16'
}
const MAX_SEGMENTS = 10
const SEG_SEC = 60

function parseColor(s) {
  const c = String(s || '').trim().toLowerCase()
  if (COLORS[c]) return COLORS[c]
  return /^#?[0-9a-f]{6}$/i.test(c) ? (c.startsWith('#') ? c : `#${c}`) : null
}

// "Teks | warna | 3 | https://chat.whatsapp.com/xxx | https://media.mp4"
function parseArgs(text) {
  const out = { caption: '', color: null, font: null, invite: '', mediaUrl: '' }
  for (const v of String(text || '').split('|').map((x) => x.trim()).filter(Boolean)) {
    const inv = v.match(/chat\.whatsapp\.com\/([A-Za-z0-9_-]+)/i)
    if (inv && !out.invite) out.invite = inv[1]
    else if (/^https?:\/\/\S+$/i.test(v) && !out.caption && !out.mediaUrl) out.mediaUrl = v
    else if (!out.color && parseColor(v)) out.color = parseColor(v)
    else if (!out.font && /^[1-5]$/.test(v)) out.font = parseInt(v, 10)
    else if (!out.caption) out.caption = v
  }
  return out
}

const kindOfMime = (mime) => (/webp/i.test(mime) ? 'sticker' : /^image\//i.test(mime) ? 'image' : /^video\//i.test(mime) ? 'video' : /^audio\//i.test(mime) ? 'audio' : '')

// Cari media dari pesan / reply / link -> { kind, buffer } | null
async function resolveMedia(sock, msg, url) {
  const m = await getMedia(sock, msg, ['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage'])
  if (m) {
    const map = { imageMessage: 'image', videoMessage: 'video', audioMessage: 'audio', stickerMessage: 'sticker' }
    const kind = map[m.type] || kindOfMime(m.info?.mimetype)
    return kind ? { kind, buffer: m.buffer, gif: !!m.info?.gifPlayback } : null
  }
  if (url) {
    const r = await fetchPublic(url, { maxBytes: 50 * 1024 * 1024, timeout: 40000 })
    const kind = kindOfMime(r.contentType) || (/\.(jpe?g|png)$/i.test(url) ? 'image' : /\.webp$/i.test(url) ? 'sticker' : /\.(mp4|mov|webm)$/i.test(url) ? 'video' : /\.(mp3|m4a|ogg|wav|opus)$/i.test(url) ? 'audio' : '')
    if (!kind) throw new Error('Jenis file dari link tidak dikenali (butuh gambar/video/audio)')
    return { kind, buffer: r.buffer }
  }
  return null
}

async function waveform(buffer, bars = 64) {
  try {
    const raw = await ffm.run(buffer, 'raw', (i, o) => ['-i', i, '-ac', '1', '-ar', '16000', '-f', 's16le', o])
    const n = Math.floor(raw.length / 2)
    if (n <= 0) return undefined
    const size = Math.floor(n / bars) || 1
    const avg = []
    for (let b = 0; b < bars; b++) {
      let sum = 0
      let c = 0
      for (let i = b * size; i < Math.min(n, (b + 1) * size); i++, c++) sum += Math.abs(raw.readInt16LE(i * 2)) / 32768
      avg.push(c ? sum / c : 0)
    }
    const max = Math.max(...avg) || 1
    return new Uint8Array(avg.map((v) => Math.floor((v / max) * 100)))
  } catch {
    return undefined
  }
}

// -> array { content, label }
async function buildPayloads(media, caption, notify = async () => {}) {
  const cap = caption || ''
  if (media.kind === 'image') return [{ content: { image: media.buffer, caption: cap }, label: 'gambar' }]
  if (media.kind === 'sticker') {
    const sharp = require('sharp')
    const animated = media.buffer.includes(Buffer.from('ANIM'))
    if (!animated) return [{ content: { image: await sharp(media.buffer).png().toBuffer(), caption: cap }, label: 'stiker' }]
    const gif = await sharp(media.buffer, { animated: true }).gif().toBuffer()
    const mp4 = await ffm.run(gif, 'mp4', (i, o) => ['-i', i, '-movflags', 'faststart', '-pix_fmt', 'yuv420p', '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', o])
    return [{ content: { video: mp4, caption: cap, gifPlayback: true }, label: 'stiker animasi' }]
  }
  if (media.kind === 'audio') {
    const ogg = await ffm.run(media.buffer, 'ogg', (i, o) => ['-i', i, '-vn', '-map_metadata', '-1', '-c:a', 'libopus', '-b:a', '48k', '-ac', '1', '-ar', '48000', '-application', 'voip', o])
    const seconds = (await ffm.duration(ogg)) || undefined
    return [{ content: { audio: ogg, mimetype: 'audio/ogg; codecs=opus', ptt: true, seconds, waveform: await waveform(ogg) }, label: 'suara' }]
  }
  // video
  const dur = await ffm.duration(media.buffer)
  if (dur <= SEG_SEC) return [{ content: { video: media.buffer, caption: cap, ...(media.gif ? { gifPlayback: true } : {}) }, label: 'video' }]
  const total = Math.min(Math.ceil(dur / SEG_SEC), MAX_SEGMENTS)
  await notify(`✂️ Video ${Math.floor(dur / 60)}m ${dur % 60}s dipotong ${total} bagian per ${SEG_SEC} detik${Math.ceil(dur / SEG_SEC) > total ? ` (maks ${MAX_SEGMENTS} bagian)` : ''}.`)
  const out = []
  for (let i = 0; i < total; i++) {
    const seg = await ffm.run(media.buffer, 'mp4', (inp, o) => ['-ss', String(i * SEG_SEC), '-i', inp, '-t', String(SEG_SEC), '-c:v', 'libx264', '-c:a', 'aac', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', o], 180000)
    out.push({ content: { video: seg, caption: i === 0 ? cap : `(${i + 1}/${total})` }, label: `video ${i + 1}/${total}` })
  }
  return out
}

const supported = () => 'groupStatusMessageV2' in (baileys.proto?.Message?.prototype || {})

async function postStatus(sock, jid, content, style = {}) {
  if (!supported()) throw new Error('UNSUPPORTED')
  const c = { ...content }
  const inside = await baileys.generateWAMessageContent(c, { upload: sock.waUploadToServer, backgroundColor: style.color || undefined, textColor: style.textColor || undefined, font: style.font || undefined })
  const messageSecret = crypto.randomBytes(32)
  const m = baileys.generateWAMessageFromContent(jid, { messageContextInfo: { messageSecret }, groupStatusMessageV2: { message: { ...inside, messageContextInfo: { messageSecret } } } }, { userJid: sock.user.id })
  await sock.relayMessage(jid, m.message, { messageId: m.key.id })
  return m.key.id
}

// Siapkan semua yang akan diposting dari pesan perintah. -> { payloads, style, args } | { help:true } | { error }
async function prepare(sock, msg, text, notify) {
  const a = parseArgs(text)
  let media = null
  try {
    media = await resolveMedia(sock, msg, a.mediaUrl)
  } catch (err) {
    return { error: `Gagal mengambil media: ${err.message}` }
  }
  let caption = a.caption
  if (!caption && !media) caption = getQuotedText(msg) || ''
  if (!media && !caption) return { help: true, args: a }
  const style = { color: a.color, font: a.font }
  if (!media) {
    if (caption.length > 700) return { error: 'Teks status terlalu panjang (maks 700 karakter).' }
    return { payloads: [{ content: { text: caption }, label: 'teks' }], style, args: a }
  }
  try {
    return { payloads: await buildPayloads(media, caption, notify), style, args: a }
  } catch (err) {
    console.log('[SWGC] siapkan media gagal:', err.message)
    return { error: ffm.explain(err) }
  }
}

module.exports = { parseArgs, parseColor, resolveMedia, buildPayloads, postStatus, prepare, supported, COLORS, MAX_SEGMENTS }
