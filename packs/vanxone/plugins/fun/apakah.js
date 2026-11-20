const { pick } = require('../../lib/game')

const ANSWERS = ['Ya', 'Tidak', 'Mungkin', 'Bisa jadi', 'Jelas tidak', 'Pasti!', 'Kayaknya iya', 'Kayaknya enggak', 'Tanya lagi nanti']

module.exports = {
  name: 'apakah',
  command: ['apakah', '8ball'],
  category: 'fun',
  desc: 'Tanya bot, dijawab ya/tidak',
  usage: '<pertanyaan>',
  run: async ({ text, prefix, reply }) => {
    if (!text) return reply(`Tanya apa?\nContoh: ${prefix}apakah besok hujan`)
    await reply(`Pertanyaan: ${text}\nJawaban: *${pick(ANSWERS)}*`)
  }
}
