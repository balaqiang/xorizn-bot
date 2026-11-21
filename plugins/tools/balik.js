const fx = require('../../lib/textfx')
const { getQuotedText } = require('../../lib/utils')

module.exports = {
  name: 'balik',
  command: ['balik', 'reverse'],
  category: 'tools',
  desc: 'Balik urutan huruf teks',
  usage: '<teks>',
  run: async ({ msg, text, prefix, reply }) => {
    const input = (text || getQuotedText(msg)).trim()
    if (!input) return reply(`Masukkan teks (atau reply pesan).\nContoh: ${prefix}balik halo dunia`)
    if (input.length > 1500) return reply('Teks terlalu panjang (maks 1500 karakter).')
    return reply(fx.reverse(input))
  }
}
