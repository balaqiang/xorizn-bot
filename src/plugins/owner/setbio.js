module.exports = {
  name: 'setbio',
  command: ['setbio', 'setstatus'],
  category: 'owner',
  desc: 'Ganti bio/info WhatsApp bot',
  usage: '<teks>',
  owner: true,
  run: async ({ sock, text, prefix, reply }) => {
    if (!text) return reply(`Contoh: ${prefix}setbio xorizn-bot • online 24 jam`)
    if (text.length > 139) return reply('Bio maksimal 139 karakter.')
    try {
      await sock.updateProfileStatus(text)
      await reply('Bio bot diganti.')
    } catch {
      await reply('Gagal mengganti bio.')
    }
  }
}
