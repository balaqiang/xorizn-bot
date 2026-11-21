const { getUser, save, rp, rand, pick, duration, cooldown } = require('../../lib/game')

const CATCH = [
  ['🥾 Sepatu bekas', 500], ['🐟 Ikan mujair', 8000], ['🐟 Ikan lele', 10000], ['🐠 Ikan nila', 12000],
  ['🐡 Ikan buntal', 20000], ['🐟 Ikan gurame', 25000], ['🦑 Cumi-cumi', 30000], ['🦀 Kepiting', 40000],
  ['🦈 Anak hiu', 80000], ['🐙 Gurita', 120000]
]

module.exports = {
  name: 'mancing',
  command: ['mancing', 'fish'],
  category: 'game',
  desc: 'Mancing ikan untuk dapat uang (cooldown 5 menit)',
  run: async ({ sender, reply }) => {
    const u = getUser(sender)
    const left = cooldown(u, 'lastFish', 5 * 60 * 1000)
    if (left) return reply(`Umpanmu belum siap. Coba lagi dalam ${duration(left)}.`)

    u.lastFish = Date.now()
    if (rand(1, 100) <= 15) {
      save()
      return reply('🎣 Tali pancingmu putus dan tidak dapat apa-apa. Coba lagi nanti!')
    }

    // ikan murah lebih sering muncul
    const idx = Math.min(Math.floor(Math.pow(Math.random(), 1.8) * CATCH.length), CATCH.length - 1)
    const [name, base] = CATCH[idx]
    const money = Math.round(base * (rand(80, 120) / 100))
    u.money += money
    u.exp += 300
    save()
    await reply(`🎣 Kamu dapat *${name}*!\n▬ Money: +${rp(money)}\n▬ EXP: +300`)
  }
}
