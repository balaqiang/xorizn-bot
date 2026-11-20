const { Sticker, StickerTypes } = require('wa-sticker-formatter')
const { getMedia } = require('../../lib/utils')
const { ensureFont, wrapText } = require('../../lib/canvasfont')

const SIZE = 512

// Teks meme: putih, tepi hitam, huruf kapital. Otomatis mengecil sampai muat.
function drawCaption(g, text, cx, anchor) {
  const maxW = SIZE - 40
  let fs = 64
  let lines
  do {
    g.font = `${fs}px Impact`
    lines = wrapText(g, text, maxW)
    fs -= 4
  } while ((lines.length * (fs + 8) > SIZE * 0.35 || lines.some((l) => g.measureText(l).width > maxW)) && fs > 16)

  g.font = `${fs + 4}px Impact`
  g.textAlign = 'center'
  g.textBaseline = 'top'
  g.lineJoin = 'round'
  g.lineWidth = Math.max(4, fs / 7)
  g.strokeStyle = '#000'
  g.fillStyle = '#fff'
  const lh = fs + 12
  const total = lines.length * lh
  let y = anchor === 'top' ? 14 : SIZE - 14 - total
  for (const l of lines) {
    g.strokeText(l, cx, y)
    g.fillText(l, cx, y)
    y += lh
  }
}

module.exports = {
  name: 'smeme',
  command: ['smeme', 'stickermeme'],
  category: 'sticker',
  desc: 'Stiker meme dengan teks atas & bawah (reply gambar)',
  usage: '<teks atas>|<teks bawah>',
  run: async ({ sock, msg, from, text, config, prefix, reply }) => {
    const [topRaw, ...rest] = text.split('|')
    const top = (topRaw || '').trim().toUpperCase()
    const bottom = rest.join('|').trim().toUpperCase()
    if (!top && !bottom) return reply(`Reply/kirim gambar dengan caption.\nContoh: ${prefix}smeme teks atas|teks bawah`)

    const media = await getMedia(sock, msg, ['imageMessage'])
    if (!media) return reply('Kirim atau reply sebuah gambar (bukan stiker/video).')

    let buffer
    try {
      await ensureFont()
      const { createCanvas, loadImage } = require('@napi-rs/canvas')
      const img = await loadImage(media.buffer)
      const cv = createCanvas(SIZE, SIZE)
      const g = cv.getContext('2d')
      g.fillStyle = '#000'
      g.fillRect(0, 0, SIZE, SIZE)
      // isi kotak penuh (crop tengah)
      const scale = Math.max(SIZE / img.width, SIZE / img.height)
      const w = img.width * scale
      const h = img.height * scale
      g.drawImage(img, (SIZE - w) / 2, (SIZE - h) / 2, w, h)
      if (top) drawCaption(g, top, SIZE / 2, 'top')
      if (bottom) drawCaption(g, bottom, SIZE / 2, 'bottom')
      buffer = await cv.encode('png')
    } catch (err) {
      console.log('[SMEME] gagal:', err.message)
      return reply('Gagal membuat stiker meme. Pastikan @napi-rs/canvas terpasang dan server bisa mengunduh font.')
    }

    const sticker = new Sticker(buffer, { pack: config.stickerPack, author: config.stickerAuthor, type: StickerTypes.FULL, quality: 80 })
    await sock.sendMessage(from, { sticker: await sticker.toBuffer() }, { quoted: msg })
  }
}
