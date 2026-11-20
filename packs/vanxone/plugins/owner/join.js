module.exports = {
  name: 'join',
  command: ['join'],
  category: 'owner',
  desc: 'Masukkan bot ke grup lewat link undangan',
  usage: '<link grup>',
  owner: true,
  run: async ({ sock, text, prefix, reply }) => {
    const code = text.match(/chat\.whatsapp\.com\/([A-Za-z0-9]{10,})/i)?.[1]
    if (!code) return reply(`Contoh: ${prefix}join https://chat.whatsapp.com/xxxxxxxx`)
    try {
      await sock.groupAcceptInvite(code)
      await reply('Berhasil bergabung ke grup.')
    } catch (err) {
      await reply(`Gagal bergabung: ${err.message || 'link tidak valid / kedaluwarsa'}.`)
    }
  }
}
