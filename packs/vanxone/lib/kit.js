// lib/kit.js — helper bersama untuk paket fitur baru (editor gambar, efek audio, editor video, dll)
'use strict'

const { getMedia, getContextInfo } = require('./utils')
const ffm = require('./ffm')

const MB = 1024 * 1024
const LIMITS = { image: 15 * MB, audio: 30 * MB, video: 60 * MB }

// ---------- antrian: ffmpeg/sharp berat dijalankan maksimal N sekaligus ----------
let running = 0
const waiting = []
async function queue(fn, max = 2) {
  if (running >= max) await new Promise((r) => waiting.push(r))
  running++
  try {
    return await fn()
  } finally {
    running--
    const next = waiting.shift()
    if (next) next()
  }
}

// ---------- ambil media dari pesan / reply ----------
const IMG_TYPES = ['imageMessage', 'stickerMessage', 'documentMessage']
async function getImage(sock, msg) {
  const m = await getMedia(sock, msg, IMG_TYPES)
  if (!m) return null
  const mime = String(m.info?.mimetype || '')
  if (m.type === 'documentMessage' && !/^image\//i.test(mime)) return null
  if (m.buffer.length > LIMITS.image) throw new Error(`Gambar terlalu besar (maks ${LIMITS.image / MB} MB).`)
  return m
}
async function getAudio(sock, msg) {
  const m = await getMedia(sock, msg, ['audioMessage', 'videoMessage', 'documentMessage'])
  if (!m) return null
  const mime = String(m.info?.mimetype || '')
  if (m.type === 'documentMessage' && !/^(audio|video)\//i.test(mime)) return null
  if (m.buffer.length > LIMITS.audio * 2) throw new Error(`File terlalu besar (maks ${LIMITS.audio * 2 / MB} MB).`)
  return m
}
async function getVideo(sock, msg) {
  const m = await getMedia(sock, msg, ['videoMessage', 'documentMessage'])
  if (!m) return null
  const mime = String(m.info?.mimetype || '')
  if (m.type === 'documentMessage' && !/^video\//i.test(mime)) return null
  if (m.buffer.length > LIMITS.video) throw new Error(`Video terlalu besar (maks ${LIMITS.video / MB} MB).`)
  return m
}

// ---------- ffprobe ----------
function probe(buffer) {
  const fs = require('fs')
  const os = require('os')
  const path = require('path')
  const { spawn } = require('child_process')
  const f = path.join(os.tmpdir(), `kit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.in`)
  fs.writeFileSync(f, buffer)
  return new Promise((resolve) => {
    const p = spawn('ffprobe', ['-v', 'error', '-show_format', '-show_streams', '-of', 'json', f])
    let out = ''
    p.stdout.on('data', (d) => (out += d))
    p.on('error', () => resolve(null))
    p.on('close', () => {
      fs.rmSync(f, { force: true })
      try {
        const j = JSON.parse(out)
        const v = (j.streams || []).find((s) => s.codec_type === 'video')
        const a = (j.streams || []).find((s) => s.codec_type === 'audio')
        const fr = v?.avg_frame_rate && v.avg_frame_rate.includes('/') ? v.avg_frame_rate.split('/').map(Number) : null
        resolve({
          duration: parseFloat(j.format?.duration) || parseFloat(v?.duration) || parseFloat(a?.duration) || 0,
          bitrate: parseInt(j.format?.bit_rate, 10) || 0,
          size: parseInt(j.format?.size, 10) || buffer.length,
          format: j.format?.format_long_name || j.format?.format_name || '',
          video: v ? { codec: v.codec_name, width: v.width, height: v.height, fps: fr && fr[1] ? Math.round((fr[0] / fr[1]) * 100) / 100 : 0 } : null,
          audio: a ? { codec: a.codec_name, rate: parseInt(a.sample_rate, 10) || 44100, channels: a.channels, bitrate: parseInt(a.bit_rate, 10) || 0 } : null
        })
      } catch {
        resolve(null)
      }
    })
  })
}

// "1:30" / "90" / "1:02:03.5" / "1m30s" -> detik (null kalau tidak valid)
function parseTime(s) {
  s = String(s || '').trim().toLowerCase()
  if (!s) return null
  let m = s.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+(?:\.\d+)?)s?)?$/)
  if (m && /[hms]/.test(s)) return Number(m[1] || 0) * 3600 + Number(m[2] || 0) * 60 + Number(m[3] || 0)
  m = s.match(/^(?:(\d+):)?(\d+):(\d+(?:\.\d+)?)$/)
  if (m) return Number(m[1] || 0) * 3600 + Number(m[2]) * 60 + Number(m[3])
  m = s.match(/^(\d+(?:[.,]\d+)?)$/)
  return m ? Number(m[1].replace(',', '.')) : null
}
const fmtTime = (sec) => {
  sec = Math.max(0, Math.round(sec))
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`
}
const fmtSize = (b) => (b >= MB ? `${(b / MB).toFixed(2)} MB` : `${(b / 1024).toFixed(1)} KB`)

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const numArg = (v, def, lo, hi) => {
  const n = Number(String(v ?? '').replace(',', '.'))
  return Number.isFinite(n) && String(v ?? '').trim() !== '' ? clamp(n, lo, hi) : def
}

// ---------- kirim ----------
const sendImage = (sock, from, msg, image, caption = '') => sock.sendMessage(from, { image, caption }, { quoted: msg })
const sendVideo = (sock, from, msg, video, caption = '', gif = false) => sock.sendMessage(from, { video, caption, ...(gif ? { gifPlayback: true } : {}) }, { quoted: msg })
const sendAudio = (sock, from, msg, audio, ptt = false) =>
  sock.sendMessage(from, ptt ? { audio, mimetype: 'audio/ogg; codecs=opus', ptt: true } : { audio, mimetype: 'audio/mpeg' }, { quoted: msg })

// pesan kesalahan ramah
const explain = (err) => (err && ['nff', 'timeout'].includes(err.message) ? ffm.explain(err) : err && /terlalu besar/.test(err.message) ? err.message : 'Gagal memproses file. Pastikan formatnya benar.')

// teks setelah nama perintah (selalu utuh, termasuk baris baru)
const rest = (body) => String(body || '').replace(/^\S+[ \t]*/, '')

// ---------- pabrik plugin multi-perintah ----------
// specs: { perintah: { desc, usage, needs: 'image'|'audio'|'video'|null, heavy: true, run(ctx, media) -> hasil } }
// hasil: string | { text } | { image, caption } | { images: [buf], caption } | { document, mimetype, fileName, caption } | { audio, ptt } | { video, caption, gif }
// alias: { namaAlias: 'perintahAsli' } (tidak tampil di menu, tapi tetap bisa dipakai)
function multi({ name, category, emoji, desc, specs, alias = {} }) {
  const NEED = { image: 'gambar/stiker', audio: 'audio/VN/video', video: 'video', file: 'file/dokumen', pdf: 'file PDF' }
  const getFile = (sock, msg) => require('./docutil').getFile(sock, msg)
  const getPdf = async (sock, msg) => {
    const f = await getFile(sock, msg)
    if (f && f.sniff.kind !== 'pdf') throw Object.assign(new Error('bukan pdf'), { userMessage: 'File itu bukan PDF.' })
    return f
  }
  const GET = { image: getImage, audio: getAudio, video: getVideo, file: getFile, pdf: getPdf }
  const descs = {}
  const usages = {}
  for (const [k, v] of Object.entries(specs)) {
    descs[k] = v.desc
    usages[k] = v.usage || ''
  }
  return {
    name,
    command: [...Object.keys(specs), ...Object.keys(alias)],
    hidden: Object.keys(alias),
    multi: true,
    category,
    emoji,
    desc,
    descs,
    usages,
    needsInfo: Object.values(specs).some((v) => v.admin),
    run: async (ctx) => {
      const { sock, msg, from, command, prefix, reply, react } = ctx
      const key = specs[command] ? command : alias[command]
      const spec = specs[key]
      if (!spec) return
      if ((spec.group || spec.admin) && !ctx.isGroup) return reply(ctx.config?.mess?.only?.group || 'Fitur ini hanya bisa dipakai di grup.')
      if (spec.admin && !ctx.isAdmin && !ctx.isOwner) return reply(ctx.config?.mess?.only?.admin || 'Fitur ini khusus admin grup.')
      let media = null
      if (spec.needs) {
        try {
          media = await GET[spec.needs](sock, msg)
        } catch (err) {
          return reply(`❌ ${explain(err)}`)
        }
        if (!media) return reply(`Kirim atau reply ${NEED[spec.needs]} dengan caption ${prefix}${command}${spec.usage ? ` ${spec.usage}` : ''}\n\n${spec.desc}${spec.example ? `\nContoh: ${prefix}${command} ${spec.example}` : ''}`)
      } else if (spec.args && !ctx.text.trim() && !spec.optional) {
        return reply(`${spec.desc}\n\nCara pakai: ${prefix}${command} ${spec.usage || ''}${spec.example ? `\nContoh: ${prefix}${command} ${spec.example}` : ''}`)
      }
      if (spec.heavy) await react('⏳')
      let res
      try {
        res = await (spec.heavy ? queue(() => spec.run(ctx, media)) : spec.run(ctx, media))
      } catch (err) {
        console.log(`[${name.toUpperCase()}] ${command}:`, err.message)
        return reply(`❌ ${err.userMessage || explain(err)}`)
      }
      if (res == null) return
      if (typeof res === 'string') return reply(res)
      const q = { quoted: msg }
      if (res.text) return reply(res.text)
      if (res.images) {
        for (let i = 0; i < res.images.length; i++) {
          await sock.sendMessage(from, { image: res.images[i], caption: res.captions ? res.captions[i] : res.caption || '' }, q)
          if (res.images.length > 1) await new Promise((r) => setTimeout(r, 700))
        }
        return
      }
      if (res.documents) {
        for (const d of res.documents) {
          await sock.sendMessage(from, { document: d.buffer, mimetype: d.mime, fileName: d.name, caption: d.caption || '' }, q)
          if (res.documents.length > 1) await new Promise((r) => setTimeout(r, 700))
        }
        return
      }
      if (res.image) return sock.sendMessage(from, { image: res.image, caption: res.caption || '' }, q)
      if (res.document) return sock.sendMessage(from, { document: res.document, mimetype: res.mimetype, fileName: res.fileName, caption: res.caption || '' }, q)
      if (res.audio) return sendAudio(sock, from, msg, res.audio, !!res.ptt)
      if (res.video) return sendVideo(sock, from, msg, res.video, res.caption || '', !!res.gif)
    }
  }
}

module.exports = { multi, MB, LIMITS, queue, getImage, getAudio, getVideo, probe, parseTime, fmtTime, fmtSize, clamp, numArg, sendImage, sendVideo, sendAudio, explain, rest, getContextInfo, ffm }
