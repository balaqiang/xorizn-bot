const { getUser, save, rp, rand, pick, cooldown, duration } = require('../../lib/game')
const SYM = ['🍒', '🍋', '🍇', '⭐', '💎', '7️⃣']
const PRIZE = { '🍒': 2, '🍋': 3, '🍇': 5, '⭐': 8, '💎': 15, '7️⃣': 30 }
module.exports = {
  name: 'scratch', command: ['scratch', 'gosok', 'kartugosok'], category: 'game', emoji: '🎟️', desc: 'Kartu gosok: 3 simbol sama = menang (harga Rp2.000)', usage: '',
  run: async ({ sender, reply }) => {
    const u = getUser(sender)
    if (u.money < 2000) return reply('Uangmu kurang dari Rp2.000.')
    const left = cooldown(u, 'lastScratch', 8000)
    if (left) return reply(`Tunggu ${duration(left)} lagi.`)
    u.money -= 2000; u.lastScratch = Date.now()
    const grid = Array.from({ length: 9 }, () => pick(SYM))
    // peluang menang sengaja diatur ±18%
    if (Math.random() < 0.18) { const s = pick(SYM); const row = rand(0, 2); for (let i = 0; i < 3; i++) grid[row * 3 + i] = s }
    let win = 0, hit = ''
    for (let r = 0; r < 3; r++) { const [a, b, c] = grid.slice(r * 3, r * 3 + 3); if (a === b && b === c) { win += 2000 * PRIZE[a]; hit = a } }
    u.money += win; u.exp += 100; save()
    const rows = [0, 1, 2].map((r) => `┃ ${grid.slice(r * 3, r * 3 + 3).join(' │ ')} ┃`)
    await reply([`🎟️ *KARTU GOSOK*`, '', ...rows, '', win ? `🎉 *JACKPOT ${hit}${hit}${hit}!* +${rp(win)}` : '😢 Belum beruntung, coba lagi!', `▬ *Saldo:* ${rp(u.money)}`].join('\n'))
  }
}
