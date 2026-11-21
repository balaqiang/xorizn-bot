const fmt = require('../../lib/fmt')
const { userOf } = require('../../lib/utils')

module.exports = {
  name: 'id',
  command: ['id', 'cekid'],
  category: 'info',
  desc: 'Lihat ID chat, nomor, dan info grup',
  run: async ({ sock, msg, from, sender, isGroup, reply }) => {
    const rows = [
      ['Nama', msg.pushName || '-', '👤'],
      ['Nomor', `+${userOf(sender)}`, '📱'],
      ['JID kamu', sender, '🆔'],
      ['JID chat', from, '💬'],
      ['Tipe chat', isGroup ? 'Grup' : 'Pribadi', '🏷️']
    ]
    if (isGroup) {
      try {
        const md = await sock.groupMetadata(from)
        rows.push(['Nama grup', md.subject, '👥'], ['Anggota', `${md.participants.length} orang`, '🧮'], ['Admin', `${md.participants.filter((p) => p.admin).length} orang`, '🛡️'])
      } catch {}
    }
    await reply(fmt.card({ icon: '🆔', title: 'Info ID', rows }))
  }
}
