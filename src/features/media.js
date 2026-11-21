/**
 * Helper media bersama untuk plugin native: ambil media dari pesan / balasan, jalankan ffmpeg
 * (ffmpeg-static, jadi tidak perlu ffmpeg di PATH), konversi audio, dan baca info media.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawn } from 'node:child_process'
import bot from '../core/bot.js'
import { ffmpegPath } from './sticker.js'

const KIND = {
  image: ['imageMessage'],
  video: ['videoMessage'],
  audio: ['audioMessage'],
  sticker: ['stickerMessage'],
  document: ['documentMessage', 'documentWithCaptionMessage']
}

/** Jenis media sebuah pesan (image/video/audio/sticker), termasuk dokumen berdasarkan mimetype. */
export function kindOf(msg) {
  if (!msg?.type) return null
  for (const [k, types] of Object.entries(KIND)) if (types.includes(msg.type) && k !== 'document') return k
  if (KIND.document.includes(msg.type)) {
    const mt = String(msg.mimetype || msg.msg?.mimetype || '')
    if (mt.startsWith('image/')) return 'image'
    if (mt.startsWith('video/')) return 'video'
    if (mt.startsWith('audio/')) return 'audio'
    return 'document'
  }
  return null
}

/** Media dari pesan itu sendiri atau yang di-reply, sesuai jenis yang diminta. */
export function mediaFrom(m, kinds = ['image', 'video', 'audio']) {
  for (const src of [m, m.quoted]) {
    const k = kindOf(src)
    if (k && kinds.includes(k)) return { src, kind: k, ptt: !!src.msg?.ptt, seconds: Number(src.msg?.seconds || 0), mimetype: src.mimetype || src.msg?.mimetype || '' }
  }
  return null
}

export const tmpFile = (ext) => path.join(bot.config?.paths?.tmp || os.tmpdir(), `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`)

/** Jalankan ffmpeg dengan batas waktu. Resolve { stderr }. */
export function ffmpeg(args, timeoutMs = 180000) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath(), ['-hide_banner', '-y', ...args], { windowsHide: true })
    let err = ''
    proc.stderr.on('data', (d) => (err += d))
    const timer = setTimeout(() => {
      proc.kill('SIGKILL')
      reject(Object.assign(new Error('Proses media terlalu lama.'), { code: 'TIMEOUT' }))
    }, timeoutMs)
    proc.on('error', (e) => {
      clearTimeout(timer)
      reject(e)
    })
    proc.on('close', (code) => {
      clearTimeout(timer)
      code === 0 ? resolve({ stderr: err }) : reject(new Error(err.split('\n').filter((l) => /error|invalid|failed/i.test(l)).slice(-2).join(' ') || `ffmpeg keluar dengan kode ${code}`))
    })
  })
}

/** Buffer masuk → ffmpeg → buffer keluar. argsFn(input, output) mengembalikan argumen ffmpeg. */
export async function transcode(buffer, inExt, outExt, argsFn, timeoutMs) {
  const input = tmpFile(inExt || 'bin')
  const output = tmpFile(outExt)
  fs.writeFileSync(input, buffer)
  try {
    await ffmpeg(argsFn(input, output), timeoutMs)
    const out = fs.readFileSync(output)
    if (!out.length) throw new Error('Hasil konversi kosong.')
    return out
  } finally {
    fs.rmSync(input, { force: true })
    fs.rmSync(output, { force: true })
  }
}

const extOf = (mimetype, fallback = 'bin') => {
  const mt = String(mimetype || '').split(';')[0]
  return { 'audio/ogg': 'ogg', 'audio/mpeg': 'mp3', 'audio/mp4': 'm4a', 'audio/aac': 'aac', 'audio/wav': 'wav', 'audio/webm': 'webm', 'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov', 'video/x-matroska': 'mkv', 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }[mt] || fallback
}
export { extOf }

const MP3 = ['-c:a', 'libmp3lame', '-b:a', '160k']
const OPUS = ['-c:a', 'libopus', '-b:a', '64k', '-ac', '1', '-ar', '48000', '-application', 'voip']

/** Audio / video → MP3. */
export const toMp3 = (buffer, mimetype, maxSec = 600) => transcode(buffer, extOf(mimetype), 'mp3', (i, o) => ['-t', String(maxSec), '-i', i, '-vn', '-map_metadata', '-1', ...MP3, o], 240000)

/** Audio / video → voice note (OGG Opus, mono). */
export const toVoiceNote = (buffer, mimetype, maxSec = 600) => transcode(buffer, extOf(mimetype), 'ogg', (i, o) => ['-t', String(maxSec), '-i', i, '-vn', '-map_metadata', '-1', ...OPUS, o], 240000)

/** Terapkan filter audio. ptt=true → keluaran voice note, selain itu MP3. */
export function audioFilter(buffer, mimetype, filter, { ptt = false, maxSec = 600, pre = [] } = {}) {
  return transcode(buffer, extOf(mimetype), ptt ? 'ogg' : 'mp3', (i, o) => ['-t', String(maxSec), ...pre, '-i', i, '-vn', '-map_metadata', '-1', ...(filter ? ['-af', filter] : []), ...(ptt ? OPUS : MP3), o], 240000)
}

/** Info media dari keluaran ffmpeg: durasi (detik), kanal audio, ada video atau tidak. */
export async function probe(buffer, mimetype) {
  const input = tmpFile(extOf(mimetype))
  fs.writeFileSync(input, buffer)
  try {
    const err = await new Promise((resolve) => {
      const p = spawn(ffmpegPath(), ['-hide_banner', '-i', input], { windowsHide: true })
      let e = ''
      p.stderr.on('data', (d) => (e += d))
      p.on('close', () => resolve(e))
      p.on('error', () => resolve(''))
    })
    const d = /Duration: (\d+):(\d+):(\d+(?:\.\d+)?)/.exec(err)
    const audio = /Stream #.*Audio: ([^,\s]+)[^\n]*?(\d+) Hz, (mono|stereo|[\d.]+ channels?)/.exec(err)
    return {
      duration: d ? Number(d[1]) * 3600 + Number(d[2]) * 60 + Number(d[3]) : 0,
      hasVideo: /Stream #.*Video:/.test(err),
      audio: audio ? { codec: audio[1], rate: Number(audio[2]), channels: audio[3] === 'mono' ? 1 : audio[3] === 'stereo' ? 2 : parseInt(audio[3], 10) || 2 } : null,
      size: buffer.length
    }
  } finally {
    fs.rmSync(input, { force: true })
  }
}

export const fmtTime = (s) => {
  s = Math.max(0, Math.round(s || 0))
  const h = Math.floor(s / 3600)
  const mm = Math.floor((s % 3600) / 60)
  const ss = String(s % 60).padStart(2, '0')
  return h ? `${h}:${String(mm).padStart(2, '0')}:${ss}` : `${mm}:${ss}`
}
export const fmtSize = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`)

/** "30", "0:30", "1:02:03" → detik (null bila tidak valid). */
export function parseTime(s) {
  if (s === undefined || s === null || s === '') return null
  const parts = String(s).trim().split(':').map(Number)
  if (!parts.length || parts.some((x) => !Number.isFinite(x) || x < 0)) return null
  return parts.reduce((acc, x) => acc * 60 + x, 0)
}
