const sharp = require('sharp')
const { getMedia } = require('../../lib/utils')

module.exports = {
  name: 'toimg',
  command: ['toimg'],
  category: 'sticker',
  desc: 'Stiker jadi gambar (reply stiker)',
  run: async ({ sock, msg, from, prefix, reply }) => {
    const media = await getMedia(sock, msg, ['stickerMessage'])
    if (!media) return reply(`Reply stiker dengan ${prefix}toimg`)
    if (media.info.isAnimated) return reply('Stiker animasi belum didukung, hanya stiker biasa.')

    const png = await sharp(media.buffer).png().toBuffer()
    await sock.sendMessage(from, { image: png }, { quoted: msg })
  }
}
