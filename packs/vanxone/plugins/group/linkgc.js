const fmt = require('../../lib/fmt')

module.exports = {
  name: 'linkgc',
  command: ['linkgc', 'linkgrup'],
  category: 'group',
  desc: 'Ambil link undangan grup',
  admin: true,
  botAdmin: true,
  run: async ({ sock, msg, from, sender }) => {
    const code = await sock.groupInviteCode(from)
    const card = await fmt.groupCard(sock, from, { icon: '🔗', title: 'Link undangan grup', by: sender, rows: [['Kode', code, '🔑'], ['Link', `https://chat.whatsapp.com/${code}`, '🔗']], note: 'Jangan bagikan sembarangan. Reset dengan .revoke' })
    await sock.sendMessage(from, { text: card.text, mentions: card.mentions }, { quoted: msg })
  }
}
