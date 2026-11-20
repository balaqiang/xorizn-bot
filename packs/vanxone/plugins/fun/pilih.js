const { pick } = require('../../lib/game')

module.exports = {
  name: 'pilih',
  command: ['pilih', 'pick'],
  category: 'fun',
  desc: 'Bot memilihkan salah satu opsi',
  usage: 'a | b | c',
  run: async ({ text, prefix, reply }) => {
    const options = text.split(/\s*(?:\||,|\batau\b)\s*/i).map((s) => s.trim()).filter(Boolean)
    if (options.length < 2) return reply(`Beri minimal 2 pilihan.\nContoh: ${prefix}pilih makan | tidur | main game`)
    await reply(`Aku pilih: *${pick(options)}*`)
  }
}
