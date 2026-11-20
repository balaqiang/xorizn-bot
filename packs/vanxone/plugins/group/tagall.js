const { userOf } = require('../../lib/utils')

module.exports = {
  name: 'tagall',
  command: ['tagall'],
  category: 'group',
  desc: 'Tag semua member',
  usage: '[pesan]',
  admin: true,
  run: async ({ sock, msg, from, text, groupMetadata }) => {
    const ids = groupMetadata.participants.map((p) => p.id)
    const list = ids.map((id) => `• @${userOf(id)}`).join('\n')
    await sock.sendMessage(
      from,
      { text: `${text || 'Tag semua member'}\n\n${list}`, mentions: ids },
      { quoted: msg }
    )
  }
}
