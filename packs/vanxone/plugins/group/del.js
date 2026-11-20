const { getContextInfo } = require('../../lib/utils')

module.exports = {
  name: 'del',
  command: ['del', 'delete', 'hapus'],
  category: 'group',
  desc: 'Hapus pesan member (reply pesannya)',
  usage: 'reply',
  admin: true,
  botAdmin: true,
  run: async ({ sock, msg, from, prefix, reply }) => {
    const ci = getContextInfo(msg)
    if (!ci?.stanzaId) return reply(`Reply pesan yang mau dihapus dengan ${prefix}del`)

    await sock.sendMessage(from, {
      delete: { remoteJid: from, fromMe: false, id: ci.stanzaId, participant: ci.participant }
    })
  }
}
