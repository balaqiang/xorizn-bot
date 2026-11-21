// .uitest — diagnosa: kanal apa yang bisa dipakai tombol di dalam kartu HTML (clipboard, share, sendPrompt)
const richui = require('../../lib/richui')

module.exports = {
  name: 'uitest',
  command: ['uitest', 'tesui'],
  category: 'info',
  emoji: '🧪',
  desc: 'Tes kanal tombol pada kartu HTML',
  run: async ({ sock, from, prefix, reply }) => {
    try {
      const card = richui.uiTest({ prefix })
      await richui.sendHtml(sock, from, card.html, card.label)
    } catch (err) {
      await reply(`Gagal membuat kartu tes: ${err.message}`)
    }
  }
}
