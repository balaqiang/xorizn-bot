const { Sticker, StickerTypes } = require('wa-sticker-formatter')
const { getMedia } = require('../../lib/utils')

module.exports = {
  name: 'take',
  command: ['take', 'wm'],
  category: 'sticker',
  desc: 'Ganti nama pack & author stiker (reply stiker)',
  usage: '<pack>|<author>',
  run: async ({ sock, msg, from, text, config, prefix, reply }) => {
    const media = await getMedia(sock, msg, ['stickerMessage'])
    if (!media) return reply(`Reply stiker dengan ${prefix}take <pack>|<author>`)

    const [packRaw, ...rest] = text.split('|')
    const pack = (packRaw || '').trim() || config.stickerPack
    const author = rest.join('|').trim() || msg.pushName || config.stickerAuthor

    const sticker = new Sticker(media.buffer, { pack, author, type: StickerTypes.FULL, quality: 80 })
    await sock.sendMessage(from, { sticker: await sticker.toBuffer() }, { quoted: msg })
  }
}
