const { Sticker, StickerTypes } = require('wa-sticker-formatter')
const brat = require('../../lib/brat')

module.exports = {
  name: 'bratgif',
  command: ['bratgif', 'bratanim', 'bratsticker'],
  category: 'sticker',
  desc: 'Stiker animasi brat (teks muncul kata demi kata)',
  usage: '[white|black|green] [blur0-3] <teks>',
  run: async ({ sock, msg, from, args, config, prefix, reply }) => {
    const { theme, blur, text } = brat.parseOptions(args, msg)
    if (!text) return reply(`Masukkan teksnya (atau reply pesan).\nContoh: ${prefix}bratgif yang ini anak baik`)
    if (text.length > 60) return reply('Teks terlalu panjang untuk stiker animasi. Maksimal 60 karakter.')
    if (!brat.hasFfmpeg()) return reply('ffmpeg belum terpasang di server bot. Owner perlu menginstalnya dulu.')

    await reply('Membuat stiker animasi...')
    const res = await brat.enqueue(() => brat.renderVideo({ text, theme, blur }))
    if (res.error) return reply(res.error)

    try {
      const sticker = new Sticker(res.value, {
        pack: config.stickerPack,
        author: config.stickerAuthor,
        type: StickerTypes.FULL,
        quality: 40
      })
      await sock.sendMessage(from, { sticker: await sticker.toBuffer() }, { quoted: msg })
    } catch (err) {
      console.log('[BRATGIF] gagal:', err)
      await reply('Gagal membuat stiker animasi. Coba lagi nanti.')
    }
  }
}
