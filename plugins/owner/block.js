const { getTargets, isBot, userOf } = require('../../lib/utils')

module.exports = {
  name: 'block',
  command: ['block', 'unblock'],
  category: 'owner',
  desc: 'Blokir/buka blokir nomor di WhatsApp',
  usage: '@user / nomor',
  owner: true,
  run: async ({ sock, msg, args, command, config, prefix, reply }) => {
    const target = getTargets(msg, args).find((j) => !isBot(sock, j) && !require('../../lib/owners').isOwner(j))
    if (!target) return reply(`Tag, reply, atau tulis nomornya.\nContoh: ${prefix}${command} 628123456789`)
    try {
      await sock.updateBlockStatus(target, command)
      await reply(`${userOf(target)} ${command === 'block' ? 'diblokir' : 'dibuka blokirnya'}.`)
    } catch {
      await reply('Gagal mengubah status blokir.')
    }
  }
}
