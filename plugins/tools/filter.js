const { getMedia } = require('../../lib/utils')

const EFFECTS = {
  grayscale: (s) => s.grayscale(),
  blur: (s) => s.blur(12),
  invert: (s) => s.negate({ alpha: false }),
  sepia: (s) => s.modulate({ saturation: 0.4 }).tint({ r: 112, g: 66, b: 20 }),
  sharpen: (s) => s.sharpen({ sigma: 2 }),
  terang: (s) => s.modulate({ brightness: 1.3 }),
  gelap: (s) => s.modulate({ brightness: 0.7 }),
  vivid: (s) => s.modulate({ saturation: 1.8 }),
  flip: (s) => s.flip(),
  mirror: (s) => s.flop(),
  rotate: (s) => s.rotate(90)
}
const ALIAS = { bw: 'grayscale', hitamputih: 'grayscale', negatif: 'invert', negative: 'invert', bright: 'terang', dark: 'gelap', cermin: 'mirror' }
const MAX_BYTES = 12 * 1024 * 1024

module.exports = {
  name: 'filter',
  command: ['filter', 'efek', 'edit'],
  category: 'tools',
  desc: 'Efek gambar: grayscale, blur, invert, sepia, pixel, dll (reply gambar)',
  usage: '<efek>',
  run: async ({ sock, msg, from, args, prefix, reply }) => {
    let effect = (args[0] || '').toLowerCase()
    effect = ALIAS[effect] || effect
    const names = [...Object.keys(EFFECTS), 'pixel']
    if (!names.includes(effect)) {
      return reply(`Reply/kirim gambar dengan caption ${prefix}filter <efek>\n\nEfek tersedia:\n${names.map((n) => `• ${n}`).join('\n')}`)
    }

    const media = await getMedia(sock, msg, ['imageMessage', 'stickerMessage'])
    if (!media) return reply('Kirim atau reply sebuah gambar/stiker.')
    if (media.buffer.length > MAX_BYTES) return reply('Ukuran gambar terlalu besar (maks 12 MB).')

    let out
    try {
      const sharp = require('sharp')
      const base = sharp(media.buffer, { failOn: 'none' }).rotate()
      if (effect === 'pixel') {
        const meta = await base.metadata()
        const small = await base.clone().resize(Math.max(8, Math.round(meta.width / 24)), null, { kernel: 'nearest' }).toBuffer()
        out = await sharp(small).resize(meta.width, meta.height, { kernel: 'nearest' }).png().toBuffer()
      } else {
        out = await EFFECTS[effect](base).png().toBuffer()
      }
    } catch (err) {
      console.log('[FILTER] gagal:', err.message)
      return reply('Gagal memproses gambar. Pastikan file berupa gambar yang valid.')
    }
    await sock.sendMessage(from, { image: out, caption: `Efek: ${effect}` }, { quoted: msg })
  }
}
