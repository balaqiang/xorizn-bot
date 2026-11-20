const { getMedia } = require('../../lib/utils')

module.exports = {
  name: 'resize',
  command: ['resize', 'ubahukuran'],
  category: 'tools',
  desc: 'Ubah ukuran gambar (reply gambar)',
  usage: '<lebar>x<tinggi> | <lebar>',
  run: async ({ sock, msg, from, args, prefix, reply }) => {
    const m = (args[0] || '').toLowerCase().match(/^(\d{1,4})(?:x(\d{1,4}))?$/)
    if (!m) return reply(`Reply gambar dengan caption ${prefix}resize 800x600 (atau ${prefix}resize 800).`)
    const w = Number(m[1])
    const h = m[2] ? Number(m[2]) : null
    if (w < 16 || w > 4096 || (h && (h < 16 || h > 4096))) return reply('Ukuran harus antara 16 dan 4096 piksel.')
    const media = await getMedia(sock, msg, ['imageMessage', 'stickerMessage'])
    if (!media) return reply('Kirim atau reply sebuah gambar.')
    try {
      const out = await require('sharp')(media.buffer, { failOn: 'none' }).rotate().resize(w, h, { fit: h ? 'cover' : 'inside' }).jpeg({ quality: 90 }).toBuffer()
      await sock.sendMessage(from, { image: out, caption: `Ukuran: ${w}${h ? `x${h}` : ' (lebar)'}` }, { quoted: msg })
    } catch (e) {
      console.log('[RESIZE]', e.message)
      await reply('Gagal memproses gambar.')
    }
  }
}
