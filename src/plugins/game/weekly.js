// .weekly / .monthly — hadiah mingguan & bulanan (lebih besar dari .daily)
const { getUser, save, rp, rand, cooldown } = require('../../lib/game')

const DAY = 24 * 60 * 60 * 1000
const KIND = {
  weekly: { key: 'lastWeekly', cd: 7 * DAY, label: 'MINGGUAN', money: [250000, 400000], exp: 30000, limit: 15 },
  monthly: { key: 'lastMonthly', cd: 30 * DAY, label: 'BULANAN', money: [1200000, 2000000], exp: 150000, limit: 60 }
}

function left(ms) {
  const m = Math.ceil(ms / 60000)
  const d = Math.floor(m / 1440)
  const h = Math.floor((m % 1440) / 60)
  const mm = m % 60
  return [d && `${d} hari`, h && `${h} jam`, (mm || (!d && !h)) && `${mm} menit`].filter(Boolean).join(' ')
}

module.exports = {
  name: 'weekly',
  command: ['weekly', 'mingguan', 'monthly', 'bulanan'],
  category: 'game',
  emoji: '🎁',
  desc: 'Klaim hadiah mingguan (7 hari) atau bulanan (30 hari)',
  run: async ({ command, sender, prefix, reply }) => {
    const k = KIND[command === 'monthly' || command === 'bulanan' ? 'monthly' : 'weekly']
    const u = getUser(sender)
    const wait = cooldown(u, k.key, k.cd)
    if (wait) return reply(`Hadiah ${k.label.toLowerCase()} sudah diambil. Coba lagi dalam ${left(wait)}.`)

    const money = rand(k.money[0], k.money[1])
    u.money += money
    u.exp += k.exp
    u.limit += k.limit
    u[k.key] = Date.now()
    save()
    await reply(
      [
        `> ―――《 ❝ HADIAH ${k.label} ❞ 》―――`,
        '> 🎉 Hadiah berhasil diklaim!',
        '',
        '> [ 💰 *DAPAT* ]',
        `> ➥ Money : +${rp(money)}`,
        `> ➥ EXP : +${k.exp.toLocaleString('id-ID')}`,
        `> ➥ Limit : +${k.limit}`,
        '',
        '> ──────────────────────',
        `> 💡 Hadiah harian: ${prefix}daily • ${command === 'monthly' || command === 'bulanan' ? `mingguan: ${prefix}weekly` : `bulanan: ${prefix}monthly`}`
      ].join('\n')
    )
  }
}
