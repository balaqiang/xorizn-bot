const { Sticker, StickerTypes } = require('wa-sticker-formatter')
const { getQuotedText } = require('../../lib/utils')
const { ensureFont, wrapText } = require('../../lib/canvasfont')

const SIZE = 512
const COLORS = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#00c7be', '#0a84ff', '#bf5af2', '#ff2d92', '#ffffff']

module.exports = {
  name: 'ttp',
  command: ['ttp', 'teksstiker'],
  category: 'sticker',
  desc: 'Teks jadi stiker transparan berwarna',
  usage: '[#hex] <teks>',
  run: async ({ sock, msg, from, args, config, prefix, reply }) => {
    const words = [...args]
    let color
    if (/^#[0-9a-f]{6}$/i.test(words[0] || '')) color = words.shift()
    const text = (words.join(' ') || getQuotedText(msg)).replace(/\s+/g, ' ').trim()
    if (!text) return reply(`Masukkan teksnya (atau reply pesan).\nContoh: ${prefix}ttp halo semua\nWarna sendiri: ${prefix}ttp #ff0000 halo`)
    if (text.length > 80) return reply('Teks terlalu panjang. Maksimal 80 karakter.')

    let buffer
    try {
      await ensureFont()
      const { createCanvas } = require('@napi-rs/canvas')
      const cv = createCanvas(SIZE, SIZE)
      const g = cv.getContext('2d')
      const maxW = SIZE - 48
      let fs = 150
      let lines
      do {
        g.font = `${fs}px Impact`
        lines = wrapText(g, text, maxW)
        fs -= 6
      } while ((lines.length * (fs + 14) > SIZE - 48 || lines.some((l) => g.measureText(l).width > maxW)) && fs > 20)

      g.font = `${fs + 6}px Impact`
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      g.lineJoin = 'round'
      g.lineWidth = Math.max(6, fs / 6)
      g.strokeStyle = '#000'
      g.fillStyle = color || COLORS[Math.floor(Math.random() * COLORS.length)]
      const lh = fs + 14
      let y = SIZE / 2 - ((lines.length - 1) * lh) / 2
      for (const l of lines) {
        g.strokeText(l, SIZE / 2, y)
        g.fillText(l, SIZE / 2, y)
        y += lh
      }
      buffer = await cv.encode('png')
    } catch (err) {
      console.log('[TTP] gagal:', err.message)
      return reply('Gagal membuat stiker. Pastikan @napi-rs/canvas terpasang dan server bisa mengunduh font.')
    }

    const sticker = new Sticker(buffer, { pack: config.stickerPack, author: config.stickerAuthor, type: StickerTypes.FULL, quality: 80 })
    await sock.sendMessage(from, { sticker: await sticker.toBuffer() }, { quoted: msg })
  }
}
