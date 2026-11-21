const { userOf, sameUser } = require('../../lib/utils')

const shuffle = (a) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]] } return r }

async function members(sock, from) {
  const meta = await sock.groupMetadata(from)
  const me = [sock.user?.id, sock.user?.lid]
  return meta.participants.map((p) => p.id).filter((id) => !me.some((m) => m && sameUser(m, id)))
}

module.exports = {
  name: 'undi',
  command: ['undi', 'gacha', 'arisan'],
  category: 'group',
  desc: 'Undi pemenang acak dari member grup',
  usage: '[jumlah] [hadiah]',
  group: true,
  run: async ({ sock, msg, from, args, reply }) => {
    let n = 1
    if (/^\d+$/.test(args[0] || '')) n = Math.min(Math.max(Number(args.shift()), 1), 10)
    const prize = args.join(' ').trim()

    const list = await members(sock, from)
    if (!list.length) return reply('Tidak ada member untuk diundi.')
    const winners = shuffle(list).slice(0, n)
    await sock.sendMessage(
      from,
      {
        text: [
          '🎉 *HASIL UNDIAN*',
          ...(prize ? [`Hadiah: *${prize}*`] : []),
          '',
          ...winners.map((w, i) => `${i + 1}. @${userOf(w)}`),
          '',
          `_Dari ${list.length} member_`
        ].join('\n'),
        mentions: winners
      },
      { quoted: msg }
    )
  }
}
