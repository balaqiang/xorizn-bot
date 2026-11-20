const fmt = require('../../lib/fmt')

module.exports = {
  name: 'revoke',
  command: ['revoke', 'resetlink'],
  category: 'group',
  desc: 'Reset link undangan grup',
  admin: true,
  botAdmin: true,
  run: async ({ sock, msg, from, sender }) => {
    await sock.groupRevokeInvite(from)
    const code = await sock.groupInviteCode(from)
    const card = await fmt.groupCard(sock, from, { icon: '♻️', title: 'Link grup direset', by: sender, rows: [['Status lama', 'Link lama tidak berlaku lagi', '🚫'], ['Link baru', `https://chat.whatsapp.com/${code}`, '🔗']] })
    await sock.sendMessage(from, { text: card.text, mentions: card.mentions }, { quoted: msg })
  }
}
