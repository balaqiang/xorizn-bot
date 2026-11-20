// .ytmp4 / .ytv — video YouTube. Memakai lib/mediadl dengan banyak mesin cadangan.
const yt = require('../../lib/youtube')
const { getUrl, hostIs } = require('../../lib/downloader')
const { fetchAndSend } = require('../../lib/mediadl')

module.exports = {
  name: 'ytmp4',
  command: ['ytmp4', 'ytv', 'ytvideo'],
  category: 'downloader',
  desc: 'Unduh video YouTube (link atau judul)',
  usage: '<link youtube / judul>',
  run: async ({ sock, msg, from, text, prefix, command, react, reply }) => {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
    const qtext = quoted?.conversation || quoted?.extendedTextMessage?.text || ''
    const input = String(text || qtext || '').trim()
    if (!input) return reply(`*YOUTUBE VIDEO*\n\nContoh:\n${prefix}${command} https://youtu.be/xxxx\n${prefix}${command} honeystars`)
    react?.('⏳')
    try {
      let url = getUrl([input])
      if (!(url && hostIs(url, ['youtube.com', 'youtu.be']))) url = (await yt.search(input, 1))[0].url
      await fetchAndSend(sock, from, msg, url, { audio: false, max: 1 })
      react?.('✅')
    } catch (err) {
      react?.('❌')
      return reply(`Gagal memproses video YouTube: ${err.message}`)
    }
  }
}
