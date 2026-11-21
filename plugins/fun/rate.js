const { rand } = require('../../lib/game')

module.exports = {
  name: 'rate',
  command: ['rate', 'nilai'],
  category: 'fun',
  desc: 'Bot menilai sesuatu (0-100%)',
  usage: '<apa saja>',
  run: async ({ text, prefix, reply }) => {
    if (!text) return reply(`Mau menilai apa?\nContoh: ${prefix}rate ganteng gue`)
    await reply(`*${text}*\nNilai: *${rand(0, 100)}%*`)
  }
}
