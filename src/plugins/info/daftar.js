// .daftar / .unreg — pendaftaran pengguna. Dipakai bersama .regis on (owner): saat aktif, pengguna wajib daftar dulu.
const S = require('../../lib/engine/core')

module.exports = {
  name: 'daftar',
  command: ['daftar', 'register', 'reg', 'verify', 'unreg'],
  category: 'info',
  desc: 'Daftar sebagai pengguna bot (wajib bila owner menyalakan .regis on)',
  usage: '',
  run: async ({ sender, command, reply }) => {
    if (command === 'unreg') return reply(S.unregister(sender) ? 'Pendaftaran kamu dihapus.' : 'Kamu belum terdaftar.')
    if (!S.register(sender)) return reply('Kamu sudah terdaftar.')
    await reply('✅ Pendaftaran berhasil. Sekarang kamu bisa memakai bot.')
  }
}
