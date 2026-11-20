const { getTargets } = require('../../lib/utils')

module.exports = {
  name: 'getpp',
  command: ['getpp', 'pp', 'fotoprofil'],
  category: 'tools',
  desc: 'Ambil foto profil (tag/reply, kosong = kamu)',
  usage: '[@user]',
  run: async ({ sock, msg, from, sender, args, reply }) => {
    const target = getTargets(msg, args)[0] || sender
    try {
      const url = await sock.profilePictureUrl(target, 'image')
      await sock.sendMessage(from, { image: { url }, caption: 'Foto profil' }, { quoted: msg })
    } catch {
      await reply('Foto profil tidak ada atau disembunyikan.')
    }
  }
}
