const { userOf } = require('../../lib/utils')

module.exports = {
  name: 'listadmin',
  command: ['listadmin', 'admins', 'tagadmin'],
  category: 'group',
  desc: 'Daftar & tag admin grup',
  group: true,
  run: async ({ sock, msg, from, text }) => {
    const meta = await sock.groupMetadata(from)
    const admins = meta.participants.filter((p) => p.admin)
    const ids = admins.map((p) => p.id)
    const list = admins.map((p, i) => `${i + 1}. @${userOf(p.id)}${p.admin === 'superadmin' ? ' 👑' : ''}`).join('\n')
    await sock.sendMessage(from, { text: `*ADMIN ${meta.subject}*${text ? `\n${text}` : ''}\n\n${list}`, mentions: ids }, { quoted: msg })
  }
}
