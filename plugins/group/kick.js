const { getTargets, isBot } = require('../../lib/utils')
const fmt = require('../../lib/fmt')

module.exports = {
  name: 'kick',
  command: ['kick'],
  category: 'group',
  desc: 'Keluarkan member',
  usage: '@user / reply',
  admin: true,
  botAdmin: true,
  run: async ({ sock, msg, from, sender, args, prefix, reply }) => {
    const targets = getTargets(msg, args).filter((j) => !isBot(sock, j))
    if (!targets.length) return reply(`Tag atau reply member yang mau dikeluarkan.\nContoh: ${prefix}kick @user`)

    const res = await sock.groupParticipantsUpdate(from, targets, 'remove')
    const ok = res.filter((r) => String(r.status) === '200').length
    const card = await fmt.groupCard(sock, from, { icon: '🦵', title: 'Member dikeluarkan', by: sender, targets, ok, total: targets.length, note: ok < targets.length ? 'Sebagian gagal: target mungkin admin/pembuat grup, atau sudah keluar.' : '' })
    await sock.sendMessage(from, { text: card.text, mentions: card.mentions }, { quoted: msg })
  }
}
