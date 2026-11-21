const { shuffle, userOf } = require('../../lib/fx')
module.exports = {
  name: 'giveaway', command: ['giveaway', 'kocok', 'pemenang'], category: 'group', emoji: '🎁', desc: 'Admin: undi pemenang acak dari member grup (tanpa admin & bot)', usage: '<jumlah pemenang> [hadiah] [semua]',
  group: true, admin: true,
  run: async ({ sock, msg, from, args, prefix, reply }) => {
    const n = Math.max(1, Math.min(10, parseInt(args[0], 10) || 1))
    const withAdmin = args.includes('semua')
    const prize = args.slice(1).filter((a) => a !== 'semua').join(' ') || 'Kejutan spesial 🎁'
    const meta = await sock.groupMetadata(from)
    const pool = meta.participants.filter((p) => (withAdmin || !p.admin) && userOf(p.id) !== userOf(sock.user?.id)).map((p) => p.id)
    if (pool.length < n) return reply('Member yang memenuhi syarat kurang dari jumlah pemenang.')
    const win = shuffle(pool).slice(0, n)
    await sock.sendMessage(from, { text: `🎁 *GIVEAWAY*\n\n▬ *Hadiah:* ${prize}\n▬ *Peserta:* ${pool.length}\n\n🏆 *PEMENANG*\n${win.map((j, i) => `${['🥇', '🥈', '🥉'][i] || '🎉'} @${userOf(j)}`).join('\n')}\n\nSelamat! 🎊`, mentions: win }, { quoted: msg })
  }
}
