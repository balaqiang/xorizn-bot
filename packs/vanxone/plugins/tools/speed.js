const { getMedia } = require('../../lib/utils')
const ffm = require('../../lib/ffm')

module.exports = {
  name: 'speed',
  command: ['speed', 'kecepatan', 'slowmo'],
  category: 'tools',
  desc: 'Ubah kecepatan video 0.5x - 3x (reply video)',
  usage: '<0.5-3>',
  run: async ({ sock, msg, from, args, command, prefix, reply }) => {
    const x = Number(String(args[0] || (command === 'slowmo' ? '0.5' : '')).replace(',', '.'))
    if (!(x >= 0.5 && x <= 3)) return reply(`Reply video dengan caption ${prefix}speed 2  (0.5 = lambat, 2 = cepat, maks 3)`)
    const media = await getMedia(sock, msg, ['videoMessage'])
    if (!media) return reply('Kirim atau reply sebuah video.')
    if (media.buffer.length > 30 * 1024 * 1024) return reply('Video terlalu besar (maks 30 MB).')
    try {
      // audio: atempo hanya mendukung 0.5-2 per filter, jadi dirangkai bila perlu
      const atempo = x > 2 ? `atempo=2,atempo=${(x / 2).toFixed(3)}` : `atempo=${x}`
      const out = await ffm.run(media.buffer, 'mp4', (i, o) => ['-i', i, '-filter_complex', `[0:v]setpts=${(1 / x).toFixed(4)}*PTS[v];[0:a]${atempo}[a]`, '-map', '[v]', '-map', '[a]', '-pix_fmt', 'yuv420p', o], 150000).catch(() =>
        ffm.run(media.buffer, 'mp4', (i, o) => ['-i', i, '-vf', `setpts=${(1 / x).toFixed(4)}*PTS`, '-an', '-pix_fmt', 'yuv420p', o], 150000)
      )
      await sock.sendMessage(from, { video: out, mimetype: 'video/mp4', caption: `Kecepatan ${x}x` }, { quoted: msg })
    } catch (e) {
      await reply(ffm.explain(e))
    }
  }
}
