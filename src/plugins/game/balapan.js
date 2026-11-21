const { getUser, save, rp, parseAmount, rand } = require('../../lib/game')
const H = ['🐎 Kilat', '🐴 Badai', '🦄 Pelangi', '🐎 Petir', '🐴 Bayu']
module.exports = {
  name: 'balapan', command: ['balapan', 'pacuankuda', 'horse'], category: 'game', emoji: '🏇', desc: 'Taruhan balapan kuda: pilih nomor 1-5, menang x4', usage: '<taruhan> <1-5>',
  run: async ({ sender, args, prefix, reply }) => {
    const u = getUser(sender)
    const bet = parseAmount(args[0], u.money); const pk = parseInt(args[1], 10)
    if (!bet || bet < 1000 || !(pk >= 1 && pk <= 5)) return reply(`Format: ${prefix}balapan <taruhan> <1-5>\n${H.map((h, i) => `${i + 1}. ${h}`).join('\n')}`)
    if (bet > u.money) return reply(`Uangmu kurang. Saldo: ${rp(u.money)}`)
    const pos = H.map(() => 0); let w = -1
    while (w < 0) { pos.forEach((_, i) => (pos[i] += rand(0, 3))); const m = Math.max(...pos); if (m >= 20) w = pos.indexOf(m) }
    const track = pos.map((p, i) => `${i + 1}. ${'▫️'.repeat(Math.min(p, 20) / 4 | 0)}${H[i].split(' ')[0]}${i === w ? ' 🏁' : ''}`)
    const ok = w === pk - 1
    u.money += ok ? bet * 4 : -bet; u.exp += 150; save()
    await reply(`🏇 *BALAPAN KUDA*\n\n${track.join('\n')}\n\n🏆 *Juara:* ${H[w]}\n▬ *Pilihanmu:* ${H[pk - 1]}\n▬ *Hasil:* ${ok ? `MENANG +${rp(bet * 4)}` : `KALAH -${rp(bet)}`}\n▬ *Saldo:* ${rp(u.money)}`)
  }
}
