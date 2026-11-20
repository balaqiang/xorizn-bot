module.exports = {
  name: 'hidetag',
  command: ['hidetag', 'h'],
  category: 'group',
  desc: 'Tag semua member tanpa menampilkan daftar',
  usage: '<pesan>',
  admin: true,
  run: async ({ sock, from, text, prefix, groupMetadata, reply }) => {
    if (!text) return reply(`Contoh: ${prefix}hidetag halo semua`)
    const ids = groupMetadata.participants.map((p) => p.id)
    await sock.sendMessage(from, { text, mentions: ids })
  }
}
