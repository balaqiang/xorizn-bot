const rules = require('../../lib/rules')

module.exports = {
  name: 'rules',
  command: ['rules', 'aturan'],
  category: 'group',
  desc: 'Lihat aturan grup',
  group: true,
  run: async ({ from, prefix, reply }) => {
    const r = rules.get(from)
    if (!r) return reply(`Grup ini belum punya aturan. Admin bisa mengaturnya dengan ${prefix}setrules`)
    await reply(`📜 *ATURAN GRUP*\n\n${r.text}`)
  }
}
