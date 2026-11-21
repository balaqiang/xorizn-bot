// .ytmp3 / .yta — audio YouTube. Memakai lib/mediadl (scriptmind -> ytultra -> savetube -> loader.to -> cobalt -> yt-dlp):
// kalau satu server mati, otomatis pindah ke yang lain.
const yt = require('../../lib/youtube')
const { getUrl, hostIs } = require('../../lib/downloader')
const { fetchAndSend } = require('../../lib/mediadl')

module.exports = {
  name: 'ytmp3',
  command: ['ytmp3', 'yta', 'ytaudio'],
  category: 'downloader',
  desc: 'Unduh audio YouTube (link atau judul)',
  usage: '<link youtube / judul lagu>',
  run: async ({ sock, msg, from, text, prefix, command, react, reply }) => {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
    const qtext = quoted?.conversation || quoted?.extendedTextMessage?.text || ''
    const input = String(text || qtext || '').trim()
    if (!input) return reply(`*YOUTUBE AUDIO*\n\nContoh:\n${prefix}${command} https://youtu.be/xxxx\n${prefix}${command} honeystars`)
    react?.('⏳')
    try {
      let url = getUrl([input])
      let title = ''
      if (!(url && hostIs(url, ['youtube.com', 'youtu.be']))) {
        const r = (await yt.search(input, 1))[0]
        url = r.url
        title = r.title
      }
      await fetchAndSend(sock, from, msg, url, { audio: true, max: 1 })
      react?.('✅')
    } catch (err) {
      react?.('❌')
      return reply(`Gagal memproses audio YouTube: ${err.message}`)
    }
  }
}
