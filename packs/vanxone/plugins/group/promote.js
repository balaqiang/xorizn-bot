const { getTargets, isBot } = require('../../lib/utils')
const fmt = require('../../lib/fmt')

module.exports = {
  name: 'promote',
  command: ['promote'],
  category: 'group',
  desc: 'Jadikan admin',
  usage: '@user / reply',
  admin: true,
  botAdmin: true,
  run: async ({ sock, msg, from, sender, args, prefix, reply }) => {
    const targets = getTargets(msg, args).filter((j) => !isBot(sock, j))
    if (!targets.length) return reply(`Tag atau reply member yang mau dijadikan admin.\nContoh: ${prefix}promote @user`)

    const res = await sock.groupParticipantsUpdate(from, targets, 'promote')
    const ok = res.filter((r) => String(r.status) === '200').length
    const card = await fmt.groupCard(sock, from, { icon: '⬆️', title: 'Admin baru', by: sender, targets, ok, total: targets.length, note: ok < targets.length ? 'Sebagian gagal: target mungkin sudah admin atau tidak ada di grup.' : '' })
    await sock.sendMessage(from, { text: card.text, mentions: card.mentions }, { quoted: msg })
  }
}
