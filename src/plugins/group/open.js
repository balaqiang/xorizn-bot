const fmt = require('../../lib/fmt')

module.exports = {
  name: 'open',
  command: ['open', 'buka'],
  category: 'group',
  desc: 'Buka grup (semua member boleh chat)',
  admin: true,
  botAdmin: true,
  run: async ({ sock, msg, from, sender }) => {
    await sock.groupSettingUpdate(from, 'not_announcement')
    const card = await fmt.groupCard(sock, from, { icon: '🔓', title: 'Grup dibuka', by: sender, rows: [['Status', 'Semua member bisa mengirim pesan', '📡']], note: 'Tutup lagi dengan .close' })
    await sock.sendMessage(from, { text: card.text, mentions: card.mentions }, { quoted: msg })
  }
}
