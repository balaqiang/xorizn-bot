const { pick } = require('../../lib/fx')
const W = ['Maaf, tadi sinyalku hilang total', 'Aku ketiduran, alarm gak bunyi', 'HP-ku mati kehabisan baterai', 'Ban motor bocor di jalan', 'Kucingku sakit mendadak', 'Listrik padam sejak pagi', 'Aku lupa kalau hari ini ada acara', 'Lagi antre panjang banget di bank', 'Perutku sakit tiba-tiba', 'Ada tamu dadakan di rumah', 'Hujan deras, jalanan banjir', 'Laptop-ku restart sendiri waktu update']
const E = ['Percayalah, ini kejadian beneran 🙏', 'Sumpah, bukan alasan dibuat-buat 😭', 'Besok pasti kuganti ya!', 'Mohon dimaklumi 🙇']
module.exports = {
  name: 'alasan', command: ['alasan', 'excuse', 'ngeles'], category: 'fun', emoji: '🙇', desc: 'Generator alasan kreatif (telat, gak bisa datang, dll)', usage: '',
  run: async ({ reply }) => reply(`🙇 *GENERATOR ALASAN*\n\n"${pick(W)}. ${pick(E)}"\n\n_Gunakan dengan tanggung jawab._`)
}
