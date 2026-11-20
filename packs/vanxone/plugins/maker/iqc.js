const axios = require('axios')

module.exports = {
  name: 'iqc',
  command: ['iqc', 'fakeiphonechat'],
  category: 'maker',
  desc: 'Membuat fake iPhone chat quoted',
  usage: '<teks>',
  run: async ({ sock, msg, from, args, text, prefix, reply }) => {
    const m = msg
    const conn = sock

    if (!text) {
      return reply(`*🧩 Masukkan teks!*\n*Contoh: ${prefix}iqc info kangg*`)
    }

    try {
      await conn.sendMessage(from, {
        react: { text: '⏳', key: m.key }
      })
    } catch {}

    const primary =
      `https://brat.siputzx.my.id/iphone-quoted` +
      `?time=12.00` +
      `&batteryPercentage=90` +
      `&carrierName=AXIS` +
      `&messageText=${encodeURIComponent(text)}` +
      `&emojiStyle=apple`

    const fallback =
      `https://api.nexray.eu.cc/maker/iqc?text=${encodeURIComponent(text)}`

    try {
      await axios.get(primary, {
        responseType: 'arraybuffer',
        timeout: 15000
      })

      await conn.sendMessage(from, {
        image: { url: primary },
        caption: '*✨ iPhone chat berhasil dibuat*'
      }, { quoted: m })

    } catch (e) {
      console.log('[IQC] Primary gagal, memakai fallback...')

      try {
        await axios.get(fallback, {
          responseType: 'arraybuffer',
          timeout: 15000
        })

        await conn.sendMessage(from, {
          image: { url: fallback },
          caption: '*✨ iPhone chat berhasil dibuat (Fallback API)*'
        }, { quoted: m })

      } catch (err) {
        console.error('[IQC Fallback]', err)
        await reply('*🍂 Semua server sedang bermasalah. Coba lagi nanti.*')
      }
    } finally {
      try {
        await conn.sendMessage(from, {
          react: { text: '', key: m.key }
        })
      } catch {}
    }
  }
}
