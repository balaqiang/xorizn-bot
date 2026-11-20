const axios = require('axios')

module.exports = {
  name: 'shorten',
  command: ['shorten', 'short', 'tinyurl'],
  category: 'tools',
  desc: 'Pendekkan link',
  usage: '<link>',
  run: async ({ args, prefix, reply }) => {
    const url = args.join(' ').match(/https?:\/\/\S+/i)?.[0]
    if (!url) return reply(`Contoh: ${prefix}shorten https://example.com/halaman/panjang`)
    try {
      const { data } = await axios.get('https://tinyurl.com/api-create.php', { params: { url }, timeout: 15000 })
      if (!/^https?:\/\//.test(String(data))) throw new Error('bad')
      await reply(`*LINK PENDEK*\n\n${String(data).trim()}`)
    } catch {
      await reply('Gagal memendekkan link. Coba lagi nanti.')
    }
  }
}
