const { getTargets, isBot } = require('../../lib/utils')
const fmt = require('../../lib/fmt')

module.exports = {
  name: 'demote',
  command: ['demote'],
  category: 'group',
  desc: 'Copot admin',
  usage: '@user / reply',
  admin: true,
  botAdmin: true,
  run: async ({ sock, msg, from, sender, args, prefix, reply }) => {
    const targets = getTargets(msg, args).filter((j) => !isBot(sock, j))
    if (!targets.length) return reply(`Tag atau reply admin yang mau dicopot.\nContoh: ${prefix}demote @user`)

    const res = await sock.groupParticipantsUpdate(from, targets, 'demote')
    const ok = res.filter((r) => String(r.status) === '200').length
    const card = await fmt.groupCard(sock, from, { icon: '⬇️', title: 'Admin dicopot', by: sender, targets, ok, total: targets.length, note: ok < targets.length ? 'Sebagian gagal: target bukan admin atau pembuat grup (tidak bisa dicopot).' : '' })
    await sock.sendMessage(from, { text: card.text, mentions: card.mentions }, { quoted: msg })
  }
}
