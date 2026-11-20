const { pick, rand } = require('../../lib/fx')
const F = [
  'Seseorang akan membantumu dengan cara yang tak kamu duga.', 'Kerja kerasmu hari ini adalah investasi untuk esok.',
  'Jangan takut mencoba hal baru; kesempatan menyukai orang yang berani.', 'Kabar baik akan segera datang lewat pesan singkat.',
  'Senyum yang kamu bagikan akan kembali berlipat.', 'Sabar. Hal terbaik sedang dipersiapkan untukmu.',
  'Hari ini cocok untuk menyelesaikan yang tertunda.', 'Teman lama akan menghubungimu kembali.',
  'Rezeki kecil hari ini, tapi cukup untuk traktir diri sendiri.', 'Jangan lupa istirahat, tubuhmu juga butuh dihargai.'
]
const COLORS = ['Merah 🔴', 'Biru 🔵', 'Hijau 🟢', 'Kuning 🟡', 'Ungu 🟣', 'Oranye 🟠', 'Putih ⚪', 'Hitam ⚫']
module.exports = {
  name: 'fortune', command: ['fortune', 'nasib', 'fortunecookie'], category: 'fun', emoji: '🥠', desc: 'Kue keberuntungan: pesan, angka hoki, warna hoki', usage: '',
  run: async ({ reply }) => reply(`🥠 *FORTUNE COOKIE*\n\n_"${pick(F)}"_\n\n▬ *Angka Hoki:* ${[rand(1, 99), rand(1, 99), rand(1, 99)].join(' • ')}\n▬ *Warna Hoki:* ${pick(COLORS)}\n▬ *Jam Hoki:* ${String(rand(0, 23)).padStart(2, '0')}:${String(rand(0, 59)).padStart(2, '0')}`)
}
