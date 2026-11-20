const { getMedia } = require('../../lib/utils')

module.exports = {
  name: 'compress',
  command: ['compress', 'kompres'],
  category: 'tools',
  desc: 'Kecilkan ukuran file gambar (reply gambar)',
  usage: '[kualitas 10-90]',
  run: async ({ sock, msg, from, args, prefix, reply }) => {
    const q = Math.min(Math.max(parseInt(args[0], 10) || 55, 10), 90)
    const media = await getMedia(sock, msg, ['imageMessage'])
    if (!media) return reply(`Reply gambar dengan caption ${prefix}compress [kualitas].`)
    try {
      const out = await require('sharp')(media.buffer, { failOn: 'none' }).rotate().resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: q, mozjpeg: true }).toBuffer()
      const kb = (n) => `${(n / 1024).toFixed(0)} KB`
      await sock.sendMessage(from, { image: out, caption: `Dikompres: ${kb(media.buffer.length)} → ${kb(out.length)} (kualitas ${q})` }, { quoted: msg })
    } catch (e) {
      console.log('[COMPRESS]', e.message)
      await reply('Gagal memproses gambar.')
    }
  }
}
