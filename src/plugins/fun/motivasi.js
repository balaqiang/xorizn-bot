const { pick } = require('../../lib/game')

const LIST = [
  'Progres kecil setiap hari lebih baik daripada rencana besar yang tidak pernah dimulai.',
  'Kamu tidak harus hebat untuk memulai, tapi harus memulai untuk menjadi hebat.',
  'Capek itu wajar. Berhenti sebentar boleh, menyerah jangan.',
  'Kesalahan adalah bukti bahwa kamu sedang mencoba.',
  'Jangan bandingkan bab satu hidupmu dengan bab sepuluh hidup orang lain.',
  'Disiplin adalah jembatan antara tujuan dan hasil.',
  'Hari ini yang kamu lakukan adalah hadiah untuk dirimu di masa depan.',
  'Tidak ada jalan pintas yang sampai ke tempat yang layak dituju.',
  'Mulai dari mana kamu berada, pakai apa yang kamu punya, lakukan apa yang kamu bisa.',
  'Gagal sekali, belajar sekali. Gagal sepuluh kali, ahli sepuluh kali.',
  'Konsisten mengalahkan bakat saat bakat tidak konsisten.',
  'Tenang, tidak semua hal harus selesai hari ini.',
  'Sabar bukan berarti menunggu, tapi tetap berusaha sambil menunggu.',
  'Hal besar selalu dimulai dari langkah yang terasa sepele.',
  'Percaya prosesmu, hasilnya akan menyusul.'
]

module.exports = {
  name: 'motivasi',
  command: ['motivasi', 'quotes', 'semangat'],
  category: 'fun',
  desc: 'Kata-kata motivasi acak',
  run: async ({ reply }) => reply(`💬 _${pick(LIST)}_`)
}
