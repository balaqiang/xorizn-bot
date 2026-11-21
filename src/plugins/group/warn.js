const warns = require('../../lib/warns')
const { getTargets, isBot, userOf, getGroupInfo } = require('../../lib/utils')

module.exports = {
  name: 'warn',
  command: ['warn', 'peringatan'],
  category: 'group',
  desc: 'Beri peringatan ke member (kick otomatis di batas warn)',
  usage: '@user [alasan]',
  admin: true,
  run: async ({ sock, msg, from, args, config, prefix, reply }) => {
    const target = getTargets(msg, args).find((j) => !isBot(sock, j))
    if (!target) return reply(`Tag atau reply member.\nContoh: ${prefix}warn @user spam`)

    const info = await getGroupInfo(sock, from, target)
    if (info.isAdmin) return reply('Tidak bisa memberi peringatan ke sesama admin.')

    const reason = args.filter((a) => !a.startsWith('@') && !/^\d{8,15}$/.test(a)).join(' ')
    const limit = config.warnLimit ?? 3
    const count = warns.add(from, target, reason)
    const tag = `@${userOf(target)}`

    if (count >= limit) {
      warns.clear(from, target)
      if (info.isBotAdmin) {
        await sock.sendMessage(from, { text: `${tag} mencapai ${limit} peringatan dan dikeluarkan.`, mentions: [target] }, { quoted: msg })
        return sock.groupParticipantsUpdate(from, [target], 'remove')
      }
      return sock.sendMessage(from, { text: `${tag} mencapai ${limit} peringatan, tapi bot bukan admin sehingga tidak bisa mengeluarkan.`, mentions: [target] }, { quoted: msg })
    }
    await sock.sendMessage(
      from,
      { text: `⚠️ ${tag} diberi peringatan ${count}/${limit}${reason ? `\nAlasan: ${reason}` : ''}`, mentions: [target] },
      { quoted: msg }
    )
  }
}
