const ui = require('../../lib/ui')
const { catIcon } = require('../../lib/menuicons')
module.exports = {
  name: 'fiturcount', command: ['fitur', 'jumlahfitur', 'statfitur'], category: 'info', emoji: '🧮', desc: 'Jumlah fitur bot per kategori', usage: '',
  run: async ({ plugins, isOwner, reply }) => {
    const { groups, order, visible } = ui.collect(plugins, isOwner)
    const mx = Math.max(...order.map((c) => groups[c].length))
    await reply(`🧮 *STATISTIK FITUR*\n\n▬ *Total perintah:* ${visible.length}\n▬ *Kategori:* ${order.length}\n\n${order.map((c) => `${catIcon(c)} *${ui.labelOf(c)}* — ${groups[c].length}\n   ${'▰'.repeat(Math.max(1, Math.round((groups[c].length / mx) * 12)))}`).join('\n')}`)
  }
}
