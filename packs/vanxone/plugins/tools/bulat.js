const { getMedia } = require('../../lib/utils')

module.exports = {
  name: 'bulat',
  command: ['bulat', 'circle', 'fotobulat'],
  category: 'tools',
  desc: 'Potong gambar jadi lingkaran (PNG transparan)',
  run: async ({ sock, msg, from, prefix, reply }) => {
    const media = await getMedia(sock, msg, ['imageMessage', 'stickerMessage'])
    if (!media) return reply(`Reply gambar dengan caption ${prefix}bulat`)
    try {
      const sharp = require('sharp')
      const S = 800
      const mask = Buffer.from(`<svg width="${S}" height="${S}"><circle cx="${S / 2}" cy="${S / 2}" r="${S / 2}" fill="#fff"/></svg>`)
      const out = await sharp(media.buffer, { failOn: 'none' }).rotate().resize(S, S, { fit: 'cover' }).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer()
      await sock.sendMessage(from, { document: out, mimetype: 'image/png', fileName: 'bulat.png' }, { quoted: msg })
    } catch (e) {
      console.log('[BULAT]', e.message)
      await reply('Gagal memproses gambar.')
    }
  }
}
