const { setAfk } = require('../../lib/guard')

module.exports = {
  name: 'afk',
  command: ['afk'],
  category: 'tools',
  desc: 'Tandai dirimu sedang AFK',
  usage: '[alasan]',
  run: async ({ sender, text, reply }) => {
    setAfk(sender, text.slice(0, 100))
    await reply(`💤 Kamu sekarang AFK${text ? `: ${text.slice(0, 100)}` : ''}\nOrang yang mention kamu akan diberi tahu. Kirim pesan apa saja untuk kembali.`)
  }
}
