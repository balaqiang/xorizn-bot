// Port dari 'plugin baru' (ttdl2.js) — logika & teks output sama dengan plugin asal; dijalankan lewat runtime classic.
const S = require('../../lib/engine/core')
const formatNumber = (number) => {
  return Number(number || 0).toLocaleString()
}

const formatDuration = (seconds) => {
  if (!seconds) return '00:00'

  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')

  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')

  return `${m}:${s}`
}

const handler = async (m, { sock, text, command, usedPrefix }) => {
  try {
    const input = m.quoted?.text || text

    if (!input) {
      return m.reply(`*TIKTOK DOWNLOADER*

• Download:
${usedPrefix + command} link`)
    }

    const regex =
      /(https:\/\/(vt|vm)\.tiktok\.com\/[^\s]+|https:\/\/www\.tiktok\.com\/@[\w.-]+\/video\/\d+)/

    const parseUrl = input.match(regex)?.[0]

    if (!parseUrl) {
      return m.reply('Link TikTok tidak valid')
    }

    const res = await (
      await fetch(`https://www.tikwm.com/api/?url=${parseUrl}&hd=1`)
    ).json()

    if (!res?.data) {
      return m.reply('Gagal mengambil data TikTok')
    }

    const data = res.data

    const caption = `*TIKTOK DOWNLOADER*

• Judul: ${data.title}
• Region: ${data.region}
• Durasi: ${formatDuration(data.duration)}
• Views: ${formatNumber(data.play_count)}
• Komentar: ${formatNumber(data.comment_count)}
• Share: ${formatNumber(data.share_count)}
• Uploader: ${data.author.nickname || data.author.unique_id}`

    // FOTO
    if (data.images?.length) {

      const rich = sock.createAIRich()
        .addText(caption)

      for (const img of data.images) {
        rich.addImage(img)
      }

      await rich.send(m.chat, { quoted: m })

    // VIDEO
    } else {

      await sock.createAIRich()
        .addText(caption)
        .addVideo(data.play)
        .send(m.chat, { quoted: m })
    }

    // AUDIO
    if (data.music_info?.play) {
      await sock.sendMessage(
        m.chat,
        {
          audio: { url: data.music_info.play },
          mimetype: 'audio/mpeg',
          fileName: `${data.title}.mp3`
        },
        { quoted: m }
      )
    }

  } catch (e) {
    console.log(e)
    m.reply('Terjadi kesalahan')
  }
}

handler.command = ['tt2', 'ttdl2', 'tiktok2']
handler.limit = true

module.exports = S.wrap(handler, {"category": "downloader"})
