const { getUser, save, rp, rand, cooldown, duration } = require('../../lib/game')
module.exports = {
  name: 'hourly', command: ['hourly', 'perjam', 'jam2'], category: 'game', emoji: '⏰', desc: 'Klaim bonus kecil tiap jam', usage: '',
  run: async ({ sender, reply }) => {
    const u = getUser(sender)
    const left = cooldown(u, 'lastHourly', 3600e3)
    if (left) return reply(`⏰ Bonus jam ini sudah diambil. Lagi dalam *${duration(left)}*.`)
    const m = rand(3000, 9000); u.money += m; u.exp += 300; u.lastHourly = Date.now(); save()
    await reply(`⏰ *BONUS PER JAM*\n\n▬ *Money:* +${rp(m)}\n▬ *EXP:* +300\n▬ *Saldo:* ${rp(u.money)}`)
  }
}
