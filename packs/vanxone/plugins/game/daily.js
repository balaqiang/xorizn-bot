const { getUser, save, rp, rand, duration, cooldown } = require('../../lib/game')

const DAY = 24 * 60 * 60 * 1000

module.exports = {
  name: 'daily',
  command: ['daily', 'harian'],
  category: 'game',
  desc: 'Klaim hadiah harian',
  run: async ({ sender, reply }) => {
    const u = getUser(sender)
    const left = cooldown(u, 'lastDaily', DAY)
    if (left) return reply(`Hadiah harian sudah diambil. Coba lagi dalam ${duration(left)}.`)

    const money = rand(40000, 60000)
    u.money += money
    u.exp += 5000
    u.limit += 5
    u.lastDaily = Date.now()
    save()
    await reply(`Hadiah harian diterima!\n▬ Money: +${rp(money)}\n▬ EXP: +5.000\n▬ Limit: +5`)
  }
}
