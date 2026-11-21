module.exports = {
  name: 'base64',
  command: ['base64', 'b64'],
  category: 'tools',
  desc: 'Encode / decode Base64',
  usage: 'enc|dec <teks>',
  run: async ({ args, prefix, reply }) => {
    const mode = (args[0] || '').toLowerCase()
    const text = args.slice(1).join(' ')
    if (!['enc', 'dec'].includes(mode) || !text) {
      return reply(`Contoh:\n${prefix}base64 enc halo dunia\n${prefix}base64 dec aGFsbyBkdW5pYQ==`)
    }
    if (mode === 'enc') return reply(Buffer.from(text, 'utf8').toString('base64'))

    if (!/^[A-Za-z0-9+/=_-]+$/.test(text)) return reply('Teks bukan Base64 yang valid.')
    await reply(Buffer.from(text, 'base64').toString('utf8'))
  }
}
