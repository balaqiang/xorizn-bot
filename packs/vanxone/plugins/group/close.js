const fmt = require('../../lib/fmt')

module.exports = {
  name: 'close',
  command: ['close', 'tutup'],
  category: 'group',
  desc: 'Tutup grup (hanya admin boleh chat)',
  admin: true,
  botAdmin: true,
  run: async ({ sock, msg, from, sender }) => {
    await sock.groupSettingUpdate(from, 'announcement')
    const card = await fmt.groupCard(sock, from, { icon: '🔒', title: 'Grup ditutup', by: sender, rows: [['Status', 'Hanya admin yang bisa mengirim pesan', '📡']], note: 'Buka lagi dengan .open' })
    await sock.sendMessage(from, { text: card.text, mentions: card.mentions }, { quoted: msg })
  }
}
