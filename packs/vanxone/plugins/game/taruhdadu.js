const { getUser, save, rp, parseAmount, rand } = require('../../lib/game')
const FACE = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅']
module.exports = {
  name: 'taruhdadu', command: ['taruhdadu', 'dadubet', 'dicebet'], category: 'game', emoji: '🎲', desc: 'Tebak jumlah dua dadu: tinggi (8-12), rendah (2-6), atau 7 (x4)', usage: '<taruhan> <tinggi|rendah|7>',
  run: async ({ sender, args, prefix, reply }) => {
    const u = getUser(sender)
    const bet = parseAmount(args[0], u.money)
    const pick = (args[1] || '').toLowerCase()
    if (!bet || bet < 500 || !['tinggi', 'rendah', '7', 'tujuh'].includes(pick)) return reply(`Format: ${prefix}taruhdadu <taruhan> <tinggi|rendah|7>\nContoh: ${prefix}taruhdadu 5000 tinggi`)
    if (bet > u.money) return reply(`Uangmu kurang. Saldo: ${rp(u.money)}`)
    const a = rand(1, 6), b = rand(1, 6), t = a + b
    const res = t === 7 ? '7' : t > 7 ? 'tinggi' : 'rendah'
    const mult = res === '7' ? 4 : 1
    const ok = res === (pick === 'tujuh' ? '7' : pick)
    const delta = ok ? bet * mult : -bet
    u.money += delta; u.exp += 100; save()
    await reply(`🎲 *TARUH DADU*\n\n${FACE[a]} ${FACE[b]}  →  *${t}* (${res.toUpperCase()})\n\n▬ *Pilihanmu:* ${pick}\n▬ *Hasil:* ${ok ? `MENANG +${rp(delta)}` : `KALAH -${rp(bet)}`}\n▬ *Saldo:* ${rp(u.money)}`)
  }
}
