// .swch — posting pembaruan ke Saluran (teks / gambar / video / audio)
const ch = require('../../lib/channels')
const { getMedia, getQuotedText } = require('../../lib/utils')
const { panel } = require('../../lib/uitext')

module.exports = {
  name: 'swch',
  command: ['swch', 'postch', 'updatech', 'statusch'],
  category: 'channel',
  emoji: '📣',
  desc: 'Posting pembaruan ke saluran (teks, gambar, video, audio)',
  usage: '[link saluran] <teks> | kirim/reply media',
  owner: true,
  run: async ({ sock, msg, body, prefix, reply }) => {
    const raw = String(body || '').replace(/^\S+\s*/, '')
    try {
      const t = await ch.pickTarget(sock, raw)
      let media = null
      try {
        media = await getMedia(sock, msg, ['imageMessage', 'videoMessage', 'audioMessage'])
      } catch (err) {
        console.log('[CH] swch unduh media:', err.message)
        return reply('Gagal mengunduh media. Coba kirim ulang gambar/videonya.')
      }

      let content
      let kind
      if (media) {
        if (media.type === 'imageMessage') [content, kind] = [{ image: media.buffer, caption: t.rest }, 'gambar']
        else if (media.type === 'videoMessage') [content, kind] = [{ video: media.buffer, caption: t.rest }, 'video']
        else [content, kind] = [{ audio: media.buffer, mimetype: media.info?.mimetype || 'audio/mpeg', ptt: !!media.info?.ptt }, 'audio']
      } else {
        const text = t.rest || getQuotedText(msg) || ''
        if (!text) {
          return reply(
            panel('POSTING SALURAN', [
              { head: '📖 *CARA PAKAI*', lines: [`${prefix}swch <teks> → posting teks`, `Kirim/reply gambar atau video + ${prefix}swch <caption>`, `Reply audio + ${prefix}swch → posting audio`, `${prefix}swch <link saluran> <teks> → ke saluran lain`] }
            ], { tip: ch.getCurrent() ? `💡 Tujuan saat ini: ${ch.getCurrent().name}` : `💡 Atur tujuan dulu: ${prefix}setch <link saluran>` })
          )
        }
        if (text.length > 2000) return reply('Teks terlalu panjang (maks 2000 karakter).')
        ;[content, kind] = [{ text }, 'teks']
      }

      ch.assertCanPost(t)
      await sock.sendMessage(t.id, content)
      await reply(`✅ Pembaruan (${kind}) terkirim ke saluran *${t.name}*.`)
    } catch (err) {
      console.log('[CH] swch:', err.message)
      await reply(`❌ ${ch.explain(err)}`)
    }
  }
}
