const { getMedia } = require('../../lib/utils')
const ffm = require('../../lib/ffm')

module.exports = {
  name: 'tovideo',
  command: ['tovideo', 'tomp4', 'togif'],
  category: 'sticker',
  desc: 'Ubah stiker animasi jadi video (reply stiker)',
  run: async ({ sock, msg, from, prefix, reply }) => {
    const media = await getMedia(sock, msg, ['stickerMessage'])
    if (!media) return reply(`Reply stiker animasi dengan caption ${prefix}tovideo`)
    try {
      // ffmpeg tidak bisa membaca WebP animasi, jadi diubah dulu ke GIF lewat sharp
      const meta = await require('sharp')(media.buffer, { animated: true }).metadata()
      if (!meta.pages || meta.pages < 2) return reply('Stiker ini tidak beranimasi.')
      const gif = await require('sharp')(media.buffer, { animated: true }).gif().toBuffer()
      const out = await ffm.run(gif, 'mp4', (i, o) => ['-i', i, '-movflags', 'faststart', '-pix_fmt', 'yuv420p', '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', o])
      await sock.sendMessage(from, { video: out, mimetype: 'video/mp4', gifPlayback: true }, { quoted: msg })
    } catch (e) {
      console.log('[TOVIDEO]', e.message)
      await reply(`${ffm.explain(e)}\nPastikan yang di-reply adalah stiker animasi.`)
    }
  }
}
