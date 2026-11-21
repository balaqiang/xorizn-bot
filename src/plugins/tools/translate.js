const axios = require('axios')
const { getQuotedText } = require('../../lib/utils')

const LANG = /^[a-z]{2,3}(-[a-z]{2,4})?$/i

module.exports = {
  name: 'translate',
  command: ['translate', 'tr', 'terjemah'],
  category: 'tools',
  desc: 'Terjemahkan teks (default ke Indonesia)',
  usage: '[kode bahasa] <teks> / reply',
  run: async ({ msg, args, prefix, reply }) => {
    const quoted = getQuotedText(msg)
    let lang = 'id'
    let text = args.join(' ')

    if (args[0] && LANG.test(args[0]) && (args.length > 1 || quoted)) {
      lang = args[0].toLowerCase()
      text = args.slice(1).join(' ')
    }
    text = text || quoted
    if (!text) return reply(`Contoh: ${prefix}tr en selamat pagi\nAtau reply pesan dengan ${prefix}tr en`)

    try {
      const { data } = await axios.get('https://translate.googleapis.com/translate_a/single', {
        params: { client: 'gtx', sl: 'auto', tl: lang, dt: 't', q: text.slice(0, 1500) },
        timeout: 15000
      })
      const result = (data?.[0] || []).map((x) => x[0]).join('')
      if (!result) throw new Error('kosong')
      await reply(`*Terjemahan* (${data[2] || 'auto'} → ${lang})\n\n${result}`)
    } catch {
      await reply('Gagal menerjemahkan. Cek kode bahasa (contoh: en, id, ja) atau coba lagi nanti.')
    }
  }
}
