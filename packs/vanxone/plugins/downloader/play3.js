const yt = require('../../lib/youtube')
const { sendCarousel, richOrText, btn } = require('../../lib/interactive')
const { readiness } = require('../../lib/mediadl')

module.exports = {
  name: 'play3',
  command: ['play3', 'carousel'],
  category: 'downloader',
  desc: 'Cari YouTube, tampil carousel 5 hasil dengan tombol Audio & Video (gaya lama)',
  usage: '<judul>',
  run: async ({ sock, msg, from, text, prefix, config, reply }) => {
    if (!text) return reply(`Masukkan judul lagu/video.\nContoh: ${prefix}play3 lofi hip hop`)

    yt.react(sock, msg, '🔎')

    let results
    try {
      results = await yt.search(text, 5)
    } catch (err) {
      return reply(err.message)
    }

    const intro = `🔎 *HASIL PENCARIAN*\n"${yt.cut(text, 60)}"${readiness() ? `\n\n${readiness()}` : ''}`

    const thumbs = await Promise.all(results.map((r) => yt.thumbBuffer(r.id)))
    const fallback = [
      intro,
      '',
      ...results.map(
        (r, i) => `${i + 1}. *${r.title}*\n   ${r.channel} • ${r.duration}\n   ${prefix}ytmp3 ${r.url}\n   ${prefix}ytmp4 ${r.url}`
      )
    ].join('\n')

    await richOrText(
      sock,
      from,
      msg,
      config,
      () =>
        sendCarousel(sock, from, {
          body: intro,
          footer: config.footer,
          quoted: msg,
          cards: results.map((r, i) => ({
            media: thumbs[i] ? { image: thumbs[i] } : undefined,
            body: `*${yt.cut(r.title, 70)}*\n${yt.cut(r.channel, 40)} • ${r.duration}`,
            footer: `Hasil ${i + 1}/${results.length}${r.views ? ` • ${r.views}` : ''}`,
            buttons: [btn.reply('🎵 Audio', `${prefix}ytmp3 ${r.url}`), btn.reply('🎬 Video', `${prefix}ytmp4 ${r.url}`)]
          }))
        }),
      fallback
    )
  }
}
