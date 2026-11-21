const { ban, unban, banList } = require('../../lib/guard')
const { getTargets, isBot, userOf } = require('../../lib/utils')

module.exports = {
  name: 'ban',
  command: ['ban', 'unban', 'banlist'],
  category: 'owner',
  desc: 'Ban/unban user dari bot (ban, unban, banlist)',
  usage: '@user [alasan]',
  owner: true,
  run: async ({ sock, msg, args, command, config, prefix, reply }) => {
    if (command === 'banlist') {
      const list = banList()
      return reply(list.length ? `*USER DI-BAN*\n\n${list.map((u, i) => `${i + 1}. ${u.id} — ${u.reason}`).join('\n')}` : 'Tidak ada user yang di-ban.')
    }

    const target = getTargets(msg, args).find((j) => !isBot(sock, j))
    if (!target) return reply(`Tag, reply, atau tulis nomornya.\nContoh: ${prefix}${command} @user`)
    if (require('../../lib/owners').isOwner(target)) return reply('Owner tidak bisa di-ban.')

    if (command === 'unban') return reply(unban(target) ? `${userOf(target)} di-unban.` : 'User itu tidak sedang di-ban.')

    const reason = args.filter((a) => !a.startsWith('@') && !/^\d{8,15}$/.test(a)).join(' ')
    ban(target, reason)
    await reply(`${userOf(target)} di-ban dari bot.${reason ? `\nAlasan: ${reason}` : ''}`)
  }
}
