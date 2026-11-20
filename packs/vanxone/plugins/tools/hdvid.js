// .hdvideo — tingkatkan kualitas video (2k/4k/1080p/720p) lewat API nexray. Butuh limit 2.
const axios = require('axios')
const { getMedia } = require('../../lib/utils')
const { uploadBuffer } = require('../../lib/upload')
const { assertPublicUrl, fetchPublic } = require('../../lib/safeurl')
const limit = require('../../lib/limit')
const richui = require('../../lib/richui')
const { panel } = require('../../lib/uitext')

const COST = 2
const RES = /^(2k|4k|1080p|720p)$/i

module.exports = {
  name: 'hdvideo',
  command: ['enhancevid', 'hdvid', 'vidhd', 'reminiplay'],
  category: 'tools',
  emoji: '🎞️',
  desc: 'Jernihkan video jadi HD / 2K / 4K (reply video atau link)',
  usage: '[2k|4k|1080p|720p] (reply video) | <link video> [resolusi]',
  run: async ({ sock, msg, from, sender, isOwner, args, prefix, command, reply, react }) => {
    let url = ''
    let res = '2k'
    for (const a of args) {
      if (/^https?:\/\//i.test(a)) url = a
      else if (RES.test(a)) res = a.toLowerCase()
    }

    let media = null
    try {
      media = await getMedia(sock, msg, ['videoMessage'])
    } catch {
      return reply('Gagal mengunduh video dari pesan. Coba kirim ulang.')
    }

    if (!media && !url) {
      return reply(
        panel('HD VIDEO', [
          { head: '📖 *CARA PAKAI*', lines: [`Reply video dengan ${prefix}${command} [resolusi]`, `${prefix}${command} <link video> [resolusi]`] },
          { head: '🎚️ *RESOLUSI*', lines: ['2k (bawaan), 4k, 1080p, 720p'] },
          { head: '💡 *CONTOH*', lines: [`${prefix}${command} 4k`, `${prefix}${command} https://contoh.com/video.mp4 2k`] }
        ], { tip: `💡 Memakai ${COST} limit per video. Proses bisa memakan beberapa menit.` })
      )
    }

    const lack = limit.lack(sender, COST, isOwner)
    if (lack) return reply(lack)

    await react('⚙️')
    try {
      if (media) {
        url = await uploadBuffer(media.buffer, `vid-${Date.now()}.mp4`)
        if (!url) return reply('❌ Gagal mengunggah video ke penyimpanan sementara. Coba lagi nanti.')
      } else {
        await assertPublicUrl(url)
      }
      const api = `https://api.nexray.eu.cc/tools/v1/hdvideo?url=${encodeURIComponent(url)}&resolusi=${encodeURIComponent(res)}`
      const { data } = await axios.get(api, { timeout: 180000 })
      if (!data?.status || !data?.result) return reply(`❌ Gagal meningkatkan kualitas video: ${String(data?.error || data?.message || 'respons tidak valid').slice(0, 200)}`)

      const out = String(data.result)
      const got = await fetchPublic(out, { maxBytes: 100 * 1024 * 1024, timeout: 120000 })
      limit.spend(sender, COST, isOwner)
      await sock.sendMessage(from, { video: got.buffer, mimetype: 'video/mp4', caption: `✨ HD VIDEO BERHASIL\nResolusi: ${res.toUpperCase()}${data.response_time ? `\nWaktu proses: ${data.response_time}` : ''}` }, { quoted: msg })
      if (richui.isRich()) await richui.sendCopy(sock, from, [{ label: 'Link hasil', value: got.url }]).catch(() => {})
      await react('✅')
    } catch (err) {
      console.log('[HDVID]', err.message)
      await reply(`❌ Gagal memproses video: ${String(err.message).slice(0, 160)}`)
    }
  }
}
