const fmt = require('../../lib/fmt')

module.exports = {
  name: 'setname',
  command: ['setname', 'setnamegc'],
  category: 'group',
  desc: 'Ganti nama grup',
  usage: '<nama baru>',
  admin: true,
  botAdmin: true,
  run: async ({ sock, msg, from, sender, text, prefix, reply }) => {
    if (!text) return reply(`Masukkan nama grup baru.\nContoh: ${prefix}setname Grup Keren`)
    if (text.length > 100) return reply('Nama grup maksimal 100 karakter.')
    let before = '-'
    try { before = (await sock.groupMetadata(from)).subject } catch {}
    await sock.groupUpdateSubject(from, text)
    const card = await fmt.groupCard(sock, from, { icon: '✏️', title: 'Nama grup diubah', by: sender, rows: [['Nama lama', before, '📝'], ['Nama baru', text, '🆕']] })
    await sock.sendMessage(from, { text: card.text, mentions: card.mentions }, { quoted: msg })
  }
}
