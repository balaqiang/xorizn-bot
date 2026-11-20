const rules = require('../../lib/rules')

module.exports = {
  name: 'setrules',
  command: ['setrules', 'setaturan'],
  category: 'group',
  desc: 'Atur aturan grup (hapus dengan .setrules hapus)',
  usage: '<teks aturan> | hapus',
  admin: true,
  run: async ({ from, text, prefix, reply }) => {
    if (!text) return reply(`Tulis aturannya.\nContoh:\n${prefix}setrules 1. Saling menghormati\n2. Dilarang spam`)
    if (['hapus', 'reset', 'delete'].includes(text.toLowerCase())) {
      return reply(rules.clear(from) ? 'Aturan grup dihapus.' : 'Grup ini belum punya aturan.')
    }
    if (text.length > 2000) return reply('Aturan terlalu panjang. Maksimal 2000 karakter.')
    rules.set(from, text)
    await reply(`✅ Aturan grup disimpan. Member bisa melihatnya dengan ${prefix}rules`)
  }
}
