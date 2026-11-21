const { getMedia } = require('../../lib/utils')

module.exports = {
  name: 'setppbot',
  command: ['setppbot', 'setpp'],
  category: 'owner',
  desc: 'Ganti foto profil bot (kirim/reply gambar)',
  owner: true,
  run: async ({ sock, msg, prefix, reply }) => {
    const media = await getMedia(sock, msg, ['imageMessage'])
    if (!media) return reply(`Kirim atau reply gambar dengan caption ${prefix}setppbot`)
    try {
      await sock.updateProfilePicture(sock.user.id, media.buffer)
      await reply('Foto profil bot diganti.')
    } catch {
      await reply('Gagal mengganti foto profil.')
    }
  }
}
