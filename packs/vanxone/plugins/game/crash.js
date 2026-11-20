// .crash <taruhan> [target x] — pesawat naik; kalau target tercapai sebelum jatuh, menang
const { getUser, save, rp, parseAmount, pick } = require('../../lib/game')
module.exports = {
  name: 'crash', command: ['crash', 'pesawat'], category: 'game', emoji: '🚀', desc: 'Game crash: pilih target pengali sebelum pesawat jatuh', usage: '<taruhan> [target mis. 2.5]',
  run: async ({ sender, args, prefix, reply }) => {
    const u = getUser(sender)
    const bet = parseAmount(args[0], u.money)
    const target = Math.min(50, Math.max(1.1, Number(String(args[1] || '2').replace(',', '.')) || 2))
    if (!bet || bet < 1000) return reply(`Format: ${prefix}crash <taruhan> [target]\nContoh: ${prefix}crash 5000 2.5\nMinimal taruhan Rp1.000.`)
    if (bet > u.money) return reply(`Uangmu kurang. Saldo: ${rp(u.money)}`)
    // crash point dengan house edge ~4%
    const r = Math.random()
    const crash = Math.max(1, Math.floor((96 / (r * 100 + 1e-9)) * 100) / 100)
    const cp = Math.min(crash, 1000)
    const win = cp >= target
    u.money += win ? Math.floor(bet * (target - 1)) : -bet
    u.exp += 200
    save()
    const trail = '🚀' + '▫️'.repeat(Math.min(10, Math.floor(cp)))
    await reply([
      `${win ? '🏆' : '💥'} *CRASH*`, '', trail, '',
      `▬ *Pesawat jatuh di:* ${cp.toFixed(2)}x`, `▬ *Targetmu:* ${target.toFixed(2)}x`, `▬ *Taruhan:* ${rp(bet)}`,
      `▬ *Hasil:* ${win ? `MENANG +${rp(Math.floor(bet * (target - 1)))}` : `KALAH -${rp(bet)}`}`, `▬ *Saldo:* ${rp(u.money)}`
    ].join('\n'))
  }
}
