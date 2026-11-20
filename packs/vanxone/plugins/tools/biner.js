const fx = require('../../lib/textfx')
const { getQuotedText } = require('../../lib/utils')

module.exports = {
  name: 'biner',
  command: ['biner', 'binary'],
  category: 'tools',
  desc: 'Teks ⇄ biner 8-bit (otomatis terdeteksi)',
  usage: '<teks | biner>',
  run: async ({ msg, text, prefix, reply }) => {
    const input = (text || getQuotedText(msg)).trim()
    if (!input) return reply(`Masukkan teks (atau reply pesan).\nContoh: ${prefix}biner halo`)
    if (input.length > 1500) return reply('Teks terlalu panjang (maks 1500 karakter).')
    if (fx.isBinary(input)) { const r = fx.fromBinary(input); return reply(r ? `🔤 ${r}` : 'Biner harus kelompok 8 digit dipisah spasi.') }
    return reply(fx.toBinary(input))
  }
}
