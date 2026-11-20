const yt = require('../../lib/youtube')
const { sendRich, richOrText, btn } = require('../../lib/interactive')

module.exports = {
  name: 'yts',
  command: ['yts', 'ytsearch'],
  category: 'downloader',
  desc: 'Cari video YouTube (daftar pilihan, pilih lalu putar)',
  usage: '<kata kunci>',
  run: async ({ react, sock, msg, from, text, prefix, config, reply }) => {
    if (!text) return reply(`Masukkan kata kunci.\nContoh: ${prefix}yts tutorial nodejs`)

    react('⏳')

    let results
    try {
      results = await yt.search(text, 10)
    } catch (err) {
      return reply(err.message)
    }

    const body = `🔎 *YOUTUBE SEARCH*\n"${yt.cut(text, 60)}"\n\nDitemukan ${results.length} video. Pilih salah satu dari daftar.`
    const fallback = [
      body,
      '',
      ...results.map((r, i) => `${i + 1}. *${r.title}*\n   ${r.channel} • ${r.duration}\n   ${r.url}`)
    ].join('\n')

    await richOrText(
      sock,
      from,
      msg,
      config,
      () =>
        sendRich(sock, from, {
          body,
          footer: config.footer,
          quoted: msg,
          buttons: [
            btn.list('PILIH VIDEO', [
              {
                title: 'HASIL PENCARIAN',
                rows: results.map((r) => ({
                  header: r.duration,
                  title: yt.cut(r.title, 24),
                  description: yt.cut(r.channel, 72),
                  id: `${prefix}play ${r.url}`
                }))
              }
            ])
          ]
        }),
      fallback
    )
  }
}
