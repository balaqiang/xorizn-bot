const fmt = require('../../lib/fmt')

module.exports = {
  name: 'setdesc',
  command: ['setdesc', 'setdeskripsi'],
  category: 'group',
  desc: 'Ganti deskripsi grup',
  usage: '<deskripsi>',
  admin: true,
  botAdmin: true,
  run: async ({ sock, msg, from, sender, text, prefix, reply }) => {
    if (!text) return reply(`Masukkan deskripsi grup baru.\nContoh: ${prefix}setdesc Dilarang spam`)
    await sock.groupUpdateDescription(from, text)
    const card = await fmt.groupCard(sock, from, { icon: '📝', title: 'Deskripsi grup diubah', by: sender, rows: [['Deskripsi baru', text.length > 300 ? `${text.slice(0, 297)}...` : text, '📄'], ['Panjang', `${text.length} karakter`, '🧮']] })
    await sock.sendMessage(from, { text: card.text, mentions: card.mentions }, { quoted: msg })
  }
}
