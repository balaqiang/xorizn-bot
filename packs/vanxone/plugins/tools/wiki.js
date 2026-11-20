const axios = require('axios')

const HEADERS = { 'User-Agent': 'vanXone-WhatsAppBot/1.1' }

module.exports = {
  name: 'wiki',
  command: ['wiki', 'wikipedia'],
  category: 'tools',
  desc: 'Cari ringkasan di Wikipedia Indonesia',
  usage: '<topik>',
  run: async ({ sock, msg, from, text, prefix, reply }) => {
    if (!text) return reply(`Contoh: ${prefix}wiki Candi Borobudur`)

    try {
      const search = await axios.get('https://id.wikipedia.org/w/api.php', {
        params: { action: 'query', list: 'search', srsearch: text, srlimit: 1, format: 'json' },
        headers: HEADERS,
        timeout: 15000
      })
      const title = search.data?.query?.search?.[0]?.title
      if (!title) return reply(`Tidak ada hasil untuk "${text}".`)

      const { data } = await axios.get(
        `https://id.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`,
        { headers: HEADERS, timeout: 15000 }
      )
      let extract = data.extract || 'Tidak ada ringkasan.'
      if (extract.length > 900) extract = `${extract.slice(0, 900).trim()}...`

      const caption = [`*${data.title || title}*`, '', extract, '', data.content_urls?.desktop?.page || ''].join('\n').trim()
      const photo = data.thumbnail?.source
      if (photo) {
        try {
          return await sock.sendMessage(from, { image: { url: photo }, caption }, { quoted: msg })
        } catch {}
      }
      await reply(caption)
    } catch {
      await reply('Gagal mengambil data Wikipedia. Coba lagi nanti.')
    }
  }
}
