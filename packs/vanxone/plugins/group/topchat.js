const activity = require('../../lib/activity')

module.exports = {
  name: 'topchat',
  command: ['topchat', 'aktif', 'topaktif'],
  category: 'group',
  desc: 'Member paling aktif di grup (sejak bot mulai mencatat)',
  usage: '[reset]',
  group: true,
  run: async ({ sock, msg, from, args, isAdmin, isOwner, reply }) => {
    if ((args[0] || '').toLowerCase() === 'reset') {
      if (!isAdmin && !isOwner) return reply('Hanya admin yang bisa mereset statistik.')
      activity.reset(from)
      return reply('Statistik aktivitas grup direset.')
    }
    const rows = activity.top(from, 10)
    if (!rows.length) return reply('Belum ada data aktivitas di grup ini.')
    const medal = ['🥇', '🥈', '🥉']
    const text = [
      '*📊 MEMBER PALING AKTIF*',
      '',
      ...rows.map(([num, n], i) => `${medal[i] || `${i + 1}.`} @${num} — ${n} pesan`),
      '',
      `Total pesan tercatat: ${activity.total(from)}`
    ].join('\n')
    await sock.sendMessage(from, { text, mentions: rows.map(([n]) => `${n}@s.whatsapp.net`) }, { quoted: msg })
  }
}
