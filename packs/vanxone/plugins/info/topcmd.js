const cs = require('../../lib/cmdstats')
const { bar } = require('../../lib/fx')
module.exports = {
  name: 'topcmd', command: ['topcmd', 'cmdpopuler', 'riwayat', 'myusage'], category: 'info', emoji: '📊', desc: 'Perintah paling sering dipakai (global) dan riwayat pemakaianmu', usage: '[saya]',
  run: async ({ command, args, sender, reply, prefix }) => {
    const mine = command === 'riwayat' || command === 'myusage' || ['saya', 'me'].includes((args[0] || '').toLowerCase())
    if (mine) {
      const u = cs.userStat(sender)
      const top = Object.entries(u.cmds).sort((a, b) => b[1] - a[1]).slice(0, 8)
      if (!u.n) return reply('Kamu belum punya riwayat pemakaian.')
      const mx = top[0][1]
      return reply(`📜 *RIWAYAT PEMAKAIANMU*\n\n▬ *Total perintah:* ${u.n}\n\n${top.map(([c, n], i) => `${['🥇', '🥈', '🥉'][i] || `${i + 1}.`} ${prefix}${c} — ${n}x\n   ${bar((n / mx) * 100, 10)}`).join('\n')}`)
    }
    const top = cs.topCmds(10)
    if (!top.length) return reply('Belum ada data pemakaian.')
    const mx = top[0][1]
    await reply(`📊 *PERINTAH TERPOPULER*\n\n▬ *Total pemakaian:* ${cs.total()}\n\n${top.map(([c, n], i) => `${['🥇', '🥈', '🥉'][i] || `${i + 1}.`} ${prefix}${c} — ${n}x\n   ${bar((n / mx) * 100, 10)}`).join('\n')}\n\n💡 ${prefix}riwayat untuk riwayat pribadimu`)
  }
}
