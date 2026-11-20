// .sider — member yang belum pernah chat (dari statistik aktivitas bot)
const activity = require('../../lib/activity')
const { userOf, isBot } = require('../../lib/utils')
const { panel } = require('../../lib/uitext')

module.exports = {
  name: 'sider',
  command: ['sider', 'diam', 'silentreader'],
  category: 'group',
  emoji: '👻',
  desc: 'Daftar member yang belum pernah chat (silent reader)',
  usage: '[tag]',
  group: true,
  admin: true,
  run: async ({ sock, msg, from, args, prefix, reply }) => {
    const meta = await sock.groupMetadata(from)
    const keys = new Set(activity.top(from, 1e9).map(([k]) => k))
    if (!keys.size) return reply('Belum ada data aktivitas di grup ini, jadi belum bisa menentukan siapa yang diam. Coba lagi setelah grup ngobrol beberapa saat.')

    const idsOf = (p) => [p.id, p.jid, p.lid, p.phoneNumber].filter(Boolean).map(userOf)
    const silent = meta.participants.filter((p) => !isBot(sock, p.id) && !idsOf(p).some((k) => keys.has(k)))
    const total = meta.participants.length
    if (!silent.length) return reply('Semua member sudah pernah chat. Grup yang hidup! 🎉')

    const tag = (args[0] || '').toLowerCase() === 'tag'
    const shown = silent.slice(0, 50)
    const display = (p) => userOf(p.phoneNumber || p.jid || p.id)
    const text = panel(
      'SILENT READER',
      [
        { head: '📊 *RINGKASAN*', lines: [`Total member : ${total}`, `Pernah chat : ${total - silent.length}`, `Belum pernah chat : ${silent.length}`] },
        { head: '👻 *DAFTAR*', lines: shown.map((p, i) => `${i + 1}. @${display(p)}${p.admin ? ' (admin)' : ''}`) }
      ],
      { tip: `💡 Dihitung sejak bot mulai mencatat. ${tag ? '' : `Ketik ${prefix}sider tag untuk menandai mereka.`}${silent.length > shown.length ? ` (+${silent.length - shown.length} lainnya)` : ''}`.trim() }
    )
    await sock.sendMessage(from, { text, mentions: tag ? shown.map((p) => p.phoneNumber || p.jid || p.id) : [] }, { quoted: msg })
  }
}
