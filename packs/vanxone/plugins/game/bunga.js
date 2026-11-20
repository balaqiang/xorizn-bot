const { getUser, save, rp, cooldown, duration } = require('../../lib/game')
module.exports = {
  name: 'bunga', command: ['bunga', 'interest', 'bungabank'], category: 'game', emoji: '🏦', desc: 'Klaim bunga bank harian 1% (maks Rp100.000)', usage: '',
  run: async ({ sender, reply }) => {
    const u = getUser(sender)
    if (u.bank < 10000) return reply('Saldo bankmu minimal Rp10.000 untuk mendapat bunga. Setor dulu dengan .deposit')
    const left = cooldown(u, 'lastBunga', 24 * 3600e3)
    if (left) return reply(`🏦 Bunga sudah diklaim. Lagi dalam *${duration(left)}*.`)
    const b = Math.min(100000, Math.floor(u.bank * 0.01)); u.bank += b; u.lastBunga = Date.now(); save()
    await reply(`🏦 *BUNGA BANK*\n\n▬ *Bunga 1%:* +${rp(b)}\n▬ *Saldo bank:* ${rp(u.bank)}`)
  }
}
