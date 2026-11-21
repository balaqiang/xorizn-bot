const { topUsers } = require('../../lib/db')
const { rp } = require('../../lib/game')

module.exports = {
  name: 'leaderboard',
  command: ['leaderboard', 'top', 'lb'],
  category: 'game',
  desc: 'Peringkat teratas (money / level)',
  usage: '[level]',
  run: async ({ args, reply }) => {
    const by = (args[0] || '').toLowerCase() === 'level' ? 'level' : 'money'
    const list = topUsers(by, 10)
    const lines = list.map(
      (u, i) => `${i + 1}. ${u.name || u.id} - ${by === 'level' ? `Level ${u.level}` : rp(u.money + u.bank)}`
    )
    await reply(`*TOP ${by === 'level' ? 'LEVEL' : 'MONEY'}*\n\n${lines.join('\n') || 'Belum ada data.'}`)
  }
}
