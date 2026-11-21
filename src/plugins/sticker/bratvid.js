const axios = require('axios')

module.exports = {
  name: 'bratvid',
  command: ['bratvid'],
  category: 'sticker',
  desc: 'Membuat stiker animasi brat video dari teks',
  usage: '<teks>',
  run: async ({ sock, msg, from, sender, args, text, prefix, reply }) => {
    const m = msg
    const conn = sock

    const inputText = args.join(' ') || m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation || m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text

    if (!inputText) {
      return reply(`✨ Masukin teks dong!\nContoh: ${prefix}bratvid halo hilman`)
    }

    try {
      const url = `https://brat.siputzx.my.id/gif?text=${encodeURIComponent(inputText)}`

      const { data } = await axios.get(url, {
        responseType: 'arraybuffer'
      })

      const buffer = Buffer.from(data)

      await conn.sendMessage(from, {
        sticker: buffer,
        packname: global.stickpack || global.namebot || ' ',
        author: global.stickauth || global.author || ' '
      }, { quoted: m })

    } catch (e) {
      console.error('[BRATVID]', e)
      return reply('Yahh error: ' + (e.message || e))
    }
  }
}
