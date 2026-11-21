const warns = require('../../lib/warns')
const { getTargets, userOf } = require('../../lib/utils')

module.exports = {
  name: 'unwarn',
  command: ['unwarn', 'resetwarn'],
  category: 'group',
  desc: 'Kurangi 1 warn (resetwarn = hapus semua)',
  usage: '@user',
  admin: true,
  run: async ({ msg, from, args, command, prefix, reply, sock }) => {
    const target = getTargets(msg, args)[0]
    if (!target) return reply(`Tag atau reply member.\nContoh: ${prefix}${command} @user`)
    const tag = `@${userOf(target)}`

    if (command === 'resetwarn') {
      warns.clear(from, target)
      return sock.sendMessage(from, { text: `Semua peringatan ${tag} dihapus.`, mentions: [target] }, { quoted: msg })
    }
    if (!warns.list(from, target).length) return reply('Member ini tidak punya peringatan.')
    const left = warns.remove(from, target)
    await sock.sendMessage(from, { text: `Peringatan ${tag} dikurangi. Sisa: ${left}.`, mentions: [target] }, { quoted: msg })
  }
}
