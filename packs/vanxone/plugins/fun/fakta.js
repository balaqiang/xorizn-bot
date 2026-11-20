const { pick } = require('../../lib/game')

const LIST = [
  'Gurita punya tiga jantung dan darahnya berwarna biru.',
  'Di Venus, satu hari (sekali berputar) lebih lama daripada satu tahunnya (sekali mengelilingi Matahari).',
  'Hiu sudah ada di Bumi lebih lama daripada pepohonan.',
  'Cahaya Matahari butuh sekitar 8 menit 20 detik untuk sampai ke Bumi.',
  'Jerapah dan manusia sama-sama punya tujuh tulang leher.',
  'Indonesia adalah negara kepulauan terbesar di dunia dengan belasan ribu pulau.',
  'Kotoran wombat berbentuk kubus.',
  'Pisang mengandung sedikit zat radioaktif alami karena kalium-40, tapi aman dimakan.',
  'Otak manusia hanya sekitar 2% dari berat tubuh, tetapi memakai sekitar 20% energi tubuh.',
  'Komodo di alam liar hanya ditemukan di Indonesia.',
  'Kupu-kupu bisa merasakan rasa lewat kakinya.',
  'Madu hampir tidak pernah basi jika disimpan dengan baik.',
  'Bumi tidak bulat sempurna, sedikit pepat di kutub dan menggembung di khatulistiwa.',
  'Lebah madu bisa mengenali wajah manusia lewat pola yang mereka pelajari.',
  'Petir bisa memanaskan udara di sekitarnya hingga sekitar lima kali lebih panas dari permukaan Matahari.'
]

module.exports = {
  name: 'fakta',
  command: ['fakta', 'faktaunik'],
  category: 'fun',
  desc: 'Fakta unik acak',
  run: async ({ reply }) => reply(`🧠 *FAKTA UNIK*\n\n${pick(LIST)}`)
}
