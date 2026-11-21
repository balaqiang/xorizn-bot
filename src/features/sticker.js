/**
 * Konversi media ⇄ stiker (WebP + metadata pack/author) memakai sharp & ffmpeg.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import sharp from 'sharp'
import bot from '../core/bot.js'

const require = createRequire(import.meta.url)

export function ffmpegPath() {
  for (const mod of ['ffmpeg-static', '@ffmpeg-installer/ffmpeg']) {
    try {
      const p = require(mod)
      const file = typeof p === 'string' ? p : p?.path
      if (file && fs.existsSync(file)) return file
    } catch {}
  }
  return 'ffmpeg'
}

export function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath(), ['-hide_banner', '-loglevel', 'error', '-y', ...args], { windowsHide: true })
    let err = ''
    proc.stderr.on('data', (d) => (err += d))
    proc.on('error', reject)
    proc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(err.trim() || `ffmpeg keluar dengan kode ${code}`))))
  })
}

const tmpFile = (ext) => path.join(bot.config?.paths?.tmp || os.tmpdir(), `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`)

/** Tambahkan metadata EXIF (nama pack & author) ke WebP. */
export async function addExif(webp, packname, author) {
  const { default: webpmux } = await import('node-webpmux')
  const img = new webpmux.Image()
  await img.load(webp)
  const json = {
    'sticker-pack-id': `xorizn-bot-${crypto.randomBytes(6).toString('hex')}`,
    'sticker-pack-name': packname || '',
    'sticker-pack-publisher': author || '',
    emojis: ['🤖']
  }
  const attr = Buffer.from([0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
  const body = Buffer.from(JSON.stringify(json), 'utf8')
  const exif = Buffer.concat([attr, body])
  exif.writeUIntLE(body.length, 14, 4)
  img.exif = exif
  return img.save(null)
}

/** Gambar / video / gif → stiker WebP. */
export async function toSticker(buffer, { mimetype = '', packname, author, crop = false } = {}) {
  const s = bot.settings || {}
  packname ??= s.packname
  author ??= s.author
  let webp
  if (/video|gif/.test(mimetype)) {
    const input = tmpFile('mp4')
    const output = tmpFile('webp')
    fs.writeFileSync(input, buffer)
    try {
      const scale = crop
        ? 'scale=512:512:force_original_aspect_ratio=increase,crop=512:512'
        : 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000'
      await runFfmpeg(['-i', input, '-t', '8', '-vf', `fps=15,${scale},format=yuva420p`, '-c:v', 'libwebp', '-loop', '0', '-q:v', '50', '-an', '-vsync', '0', output])
      webp = fs.readFileSync(output)
    } finally {
      fs.rmSync(input, { force: true })
      fs.rmSync(output, { force: true })
    }
  } else {
    webp = await sharp(buffer, { animated: true })
      .resize(512, 512, { fit: crop ? 'cover' : 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 80 })
      .toBuffer()
  }
  return addExif(webp, packname, author)
}

/** Stiker → PNG (statis) atau MP4 (animasi). */
export async function fromSticker(buffer) {
  const meta = await sharp(buffer, { animated: true }).metadata().catch(() => ({}))
  if ((meta.pages || 1) > 1) {
    const gif = await sharp(buffer, { animated: true }).gif().toBuffer()
    const input = tmpFile('gif')
    const output = tmpFile('mp4')
    fs.writeFileSync(input, gif)
    try {
      await runFfmpeg(['-i', input, '-movflags', 'faststart', '-pix_fmt', 'yuv420p', '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', output])
      return { type: 'video', buffer: fs.readFileSync(output) }
    } finally {
      fs.rmSync(input, { force: true })
      fs.rmSync(output, { force: true })
    }
  }
  return { type: 'image', buffer: await sharp(buffer).png().toBuffer() }
}

/** Grup dengan auto-stiker: setiap gambar/video pendek tanpa caption perintah diubah jadi stiker. */
export async function autoSticker(sock, m) {
  if (!['imageMessage', 'videoMessage'].includes(m.type)) return
  if (m.type === 'videoMessage' && Number(m.msg?.seconds || 0) > 10) return
  try {
    const buf = await m.download()
    const sticker = await toSticker(buf, { mimetype: m.mimetype })
    await sock.sendMessage(m.chat, { sticker }, { quoted: m.raw })
  } catch {}
}
