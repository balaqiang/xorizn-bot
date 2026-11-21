const { getMedia } = require('../../lib/utils')

module.exports = {
  name: 'setppgc',
  command: ['setppgc', 'setfotogc'],
  category: 'group',
  desc: 'Ganti foto grup (kirim/reply gambar)',
  admin: true,
  botAdmin: true,
  run: async ({ sock, msg, from, prefix, reply }) => {
    const media = await getMedia(sock, msg, ['imageMessage'])
    if (!media) return reply(`Kirim atau reply gambar dengan caption ${prefix}setppgc`)
    try {
      await sock.updateProfilePicture(from, media.buffer)
      await reply('Foto grup berhasil diganti.')
    } catch {
      await reply('Gagal mengganti foto grup.')
    }
  }
}
