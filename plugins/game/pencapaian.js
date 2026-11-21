const { getUser } = require('../../lib/game')
const { topUsers } = require('../../lib/db')
const A = [
  ['🌱 Pemula', 'Mulai bermain', (u) => true],
  ['💵 Jutawan', 'Uang+Bank ≥ Rp1.000.000', (u) => u.money + u.bank >= 1e6],
  ['💎 Miliarder', 'Uang+Bank ≥ Rp1.000.000.000', (u) => u.money + u.bank >= 1e9],
  ['🏦 Penabung', 'Saldo bank ≥ Rp500.000', (u) => u.bank >= 5e5],
  ['⭐ Level 5', 'Capai level 5', (u) => u.level >= 5],
  ['🔥 Level 10', 'Capai level 10', (u) => u.level >= 10],
  ['👑 Level 25', 'Capai level 25', (u) => u.level >= 25],
  ['🎟️ Penimbun Limit', 'Limit ≥ 100', (u) => u.limit >= 100],
  ['🗓️ Rajin Harian', 'Pernah klaim daily', (u) => !!u.lastDaily],
  ['🎣 Pemancing', 'Pernah memancing', (u) => !!u.lastFish || !!u.lastMancing],
  ['💼 Pekerja Keras', 'Pernah bekerja', (u) => !!u.lastWork]
]
module.exports = {
  name: 'pencapaian', command: ['pencapaian', 'achievement', 'badge'], category: 'game', emoji: '🏅', desc: 'Lihat badge pencapaianmu', usage: '',
  run: async ({ sender, reply }) => {
    const u = getUser(sender)
    const rows = A.map(([n, d, f]) => ({ n, d, ok: !!f(u) }))
    const done = rows.filter((r) => r.ok).length
    await reply([`🏅 *PENCAPAIAN*`, '', `▬ *Terbuka:* ${done}/${rows.length}`, `${'▰'.repeat(Math.round((done / rows.length) * 12))}${'▱'.repeat(12 - Math.round((done / rows.length) * 12))} ${Math.round((done / rows.length) * 100)}%`, '', ...rows.map((r) => `${r.ok ? '✅' : '🔒'} ${r.n} — _${r.d}_`)].join('\n'))
  }
}
