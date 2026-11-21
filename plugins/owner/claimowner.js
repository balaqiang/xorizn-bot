const owners = require('../../lib/owners')

module.exports = {
  name: 'claimowner',
  command: ['claimowner', 'jadiowner'],
  category: 'owner',
  desc: 'Daftarkan akunmu sebagai owner dengan kode dari konsol bot (chat pribadi)',
  usage: '<kode>',
  run: async ({ sender, isGroup, isOwner, args, prefix, reply }) => {
    if (isGroup) return reply('Pakai perintah ini di chat pribadi dengan bot, jangan di grup.')
    if (isOwner) return reply('Kamu sudah terdaftar sebagai owner. ✅')
    if (!args[0]) return reply(`Lihat kode di konsol/terminal bot (tertulis saat bot dijalankan), lalu kirim:\n${prefix}claimowner <kode>`)
    const r = owners.tryClaim(sender, args[0])
    if (r.error) return reply(`❌ ${r.error}`)
    await reply(`✅ Akun ini sekarang terdaftar sebagai *owner* (ID ${r.id}).\nFitur .addfitur, .join, dll sudah bisa dipakai. Hapus pesan berisi kode tadi.`)
  }
}
