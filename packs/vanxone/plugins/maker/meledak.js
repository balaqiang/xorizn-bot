const { createCanvas, loadImage } = require('@napi-rs/canvas')

const BACKGROUND_URL = 'https://raw.githubusercontent.com/himanackerman/Image/refs/heads/main/anu/10a1fe0d21270e01da6efa113c26203b.jpg'

async function removeBgNet(buffer) {
  const blob = new Blob([buffer], { type: 'image/png' })
  const form = new FormData()
  form.append('image', blob, 'image.png')
  form.append('format', 'png')
  form.append('model', 'v1')

  const res = await fetch('https://api2.pixelcut.app/image/matte/v1', {
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'x-client-version': 'web:pixa.com:4a5b0af2'
    },
    body: form
  })

  if (!res.ok) throw new Error(`Status ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

module.exports = {
  name: 'meledak',
  command: ['meledak'],
  category: 'maker',
  desc: 'Edit foto meledak remove bg',
  usage: 'reply/kirim gambar',
  run: async ({ sock, msg, from, args, text, prefix, reply }) => {
    const m = msg
    const conn = sock

    let q = m.message?.extendedTextMessage?.contextInfo?.quotedMessage ? m : msg
    // deteksi mime
    let quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage
    let mime = ''
    if (quoted) {
      mime = quoted.imageMessage?.mimetype || quoted.stickerMessage?.mimetype || ''
    } else {
      mime = m.message?.imageMessage?.mimetype || m.message?.stickerMessage?.mimetype || ''
    }

    let isMedia = /image|sticker/.test(mime)
    if (!isMedia) {
      return reply(`❌ *Cara Penggunaan:*\nKirim atau reply gambar/stiker dengan *${prefix}meledak*`)
    }

    try { await conn.sendMessage(from, { react: { text: '🕒', key: m.key } }) } catch {}

    let mediaBuffer
    try {
      const { downloadMediaMessage } = require('@whiskeysockets/baileys')
      const pino = require('pino')
      if (quoted) {
        mediaBuffer = await downloadMediaMessage({ key: m.key, message: quoted }, 'buffer', {}, { logger: pino({ level: 'silent' }), reuploadRequest: conn.updateMediaMessage })
      } else {
        mediaBuffer = await downloadMediaMessage(m, 'buffer', {}, { logger: pino({ level: 'silent' }), reuploadRequest: conn.updateMediaMessage })
      }
    } catch (_) {}

    if (!mediaBuffer) return reply('Gagal mengunduh gambar/stiker.')

    let transparentBuffer
    try {
      transparentBuffer = await removeBgNet(mediaBuffer)
    } catch (err) {
      console.log('[MELEDAK] removeBg gagal, pakai original', err.message)
      transparentBuffer = mediaBuffer
    }

    let targetImg = await loadImage(transparentBuffer)
    let bgImg
    try {
      bgImg = await loadImage(BACKGROUND_URL)
    } catch (e) {
      return reply('Gagal memuat mentahan background.')
    }

    const canvasWidth = bgImg.width
    const canvasHeight = bgImg.height

    const canvas = createCanvas(canvasWidth, canvasHeight)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight)

    let scale
    const isPortrait = targetImg.height > targetImg.width

    if (isPortrait) {
      scale = canvasHeight / targetImg.height
    } else {
      scale = (canvasWidth * 0.75) / targetImg.width
    }

    let fgWidth = targetImg.width * scale
    let fgHeight = targetImg.height * scale

    if (fgWidth > canvasWidth * 0.85) {
      scale = (canvasWidth * 0.85) / targetImg.width
      fgWidth = targetImg.width * scale
      fgHeight = targetImg.height * scale
    }

    let fgX = canvasWidth - fgWidth
    let fgY = canvasHeight - fgHeight

    ctx.drawImage(targetImg, fgX, fgY, fgWidth, fgHeight)

    const buffer = canvas.toBuffer('image/png')

    await conn.sendMessage(from, { image: buffer }, { quoted: m })
    try { await conn.sendMessage(from, { react: { text: '💥', key: m.key } }) } catch {}
  }
}
