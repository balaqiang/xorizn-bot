const fx = require('../../lib/textfx')
const { getQuotedText } = require('../../lib/utils')

module.exports = {
  name: 'mock',
  command: ['mock', 'spongebob'],
  category: 'tools',
  desc: 'Ubah teks jadi gaya aLtErNaTiNg',
  usage: '<teks>',
  run: async ({ msg, text, prefix, reply }) => {
    const input = (text || getQuotedText(msg)).trim()
    if (!input) return reply(`Masukkan teks (atau reply pesan).\nContoh: ${prefix}mock ini contoh teks`)
    if (input.length > 1500) return reply('Teks terlalu panjang (maks 1500 karakter).')
    return reply(fx.mock(input))
  }
}
