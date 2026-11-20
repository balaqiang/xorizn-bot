const warns = require('../../lib/warns')
const { getTargets, userOf } = require('../../lib/utils')

module.exports = {
  name: 'cekwarn',
  command: ['cekwarn', 'listwarn'],
  category: 'group',
  desc: 'Lihat peringatan member (kosong = kamu)',
  usage: '[@user]',
  group: true,
  run: async ({ sock, msg, from, sender, args, config }) => {
    const target = getTargets(msg, args)[0] || sender
    const list = warns.list(from, target)
    const limit = config.warnLimit ?? 3
    const text = list.length
      ? [`*PERINGATAN @${userOf(target)}* (${list.length}/${limit})`, '', ...list.map((w, i) => `${i + 1}. ${w.reason}`)].join('\n')
      : `@${userOf(target)} tidak punya peringatan.`
    await sock.sendMessage(from, { text, mentions: [target] }, { quoted: msg })
  }
}
