const { pick } = require('../../lib/game')

const LIST = [
  'Kamu tahu bedanya kamu sama kalender? Kalender bikin aku ingat tanggal, kamu bikin aku lupa waktu.',
  'Kamu itu kayak WiFi: dekat kamu, sinyal hatiku selalu penuh.',
  'Cuaca hari ini mendung ya? Soalnya senyummu terlalu terang sampai mataharinya minder.',
  'Kamu pasti capek ya? Soalnya dari tadi kamu lari-lari di pikiranku.',
  'Aku bukan fotografer, tapi aku bisa membayangkan kita berdua dalam satu frame.',
  'Kalau kamu jadi password, pasti aku susah lupa. Soalnya sudah kuhafal di luar kepala.',
  'Kamu tahu nggak bedanya kamu sama kopi? Kopi bikin melek, kamu bikin aku semangat melek terus.',
  'Aku suka matematika, tapi lebih suka kamu. Soalnya kamu satu-satunya yang nggak bikin pusing.',
  'Baterai HP-ku boleh habis, tapi semangatku buat chat kamu nggak pernah low.',
  'Kamu itu kayak buku favorit: sudah berkali-kali dibaca tapi nggak pernah bosan.'
]

module.exports = {
  name: 'gombal',
  command: ['gombal', 'gombalan'],
  category: 'fun',
  desc: 'Gombalan acak',
  run: async ({ reply }) => reply(`💘 *GOMBAL*\n\n${pick(LIST)}`)
}
