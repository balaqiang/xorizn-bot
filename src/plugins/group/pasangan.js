const { userOf, sameUser } = require('../../lib/utils')

module.exports = {
  name: 'pasangan',
  command: ['pasangan', 'couple', 'jodohgrup'],
  category: 'group',
  desc: 'Pasangkan dua member acak (hiburan)',
  group: true,
  run: async ({ sock, msg, from, reply }) => {
    const meta = await sock.groupMetadata(from)
    const me = [sock.user?.id, sock.user?.lid]
    const list = meta.participants.map((p) => p.id).filter((id) => !me.some((m) => m && sameUser(m, id)))
    if (list.length < 2) return reply('Member grup kurang dari 2.')
    const a = Math.floor(Math.random() * list.length)
    let b = Math.floor(Math.random() * (list.length - 1))
    if (b >= a) b++
    const pct = Math.floor(Math.random() * 101)
    await sock.sendMessage(
      from,
      { text: `💞 *PASANGAN HARI INI*\n\n@${userOf(list[a])} ❤️ @${userOf(list[b])}\n\nKecocokan: *${pct}%*\n_Hanya hiburan, jangan baper ya!_`, mentions: [list[a], list[b]] },
      { quoted: msg }
    )
  }
}
