const fx = require('../../lib/textfx')
const { getQuotedText } = require('../../lib/utils')

module.exports = {
  name: 'morse',
  command: ['morse', 'sandi'],
  category: 'tools',
  desc: 'Teks ⇄ kode morse (otomatis terdeteksi)',
  usage: '<teks | kode morse>',
  run: async ({ msg, text, prefix, reply }) => {
    const input = (text || getQuotedText(msg)).trim()
    if (!input) return reply(`Masukkan teks (atau reply pesan).\nContoh: ${prefix}morse halo dunia`)
    if (input.length > 1500) return reply('Teks terlalu panjang (maks 1500 karakter).')
    return reply(fx.isMorse(input) ? `🔤 ${fx.fromMorse(input)}` : `📡 ${fx.toMorse(input)}`)
  }
}
