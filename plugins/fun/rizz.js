const { pick } = require('../../lib/fx')
const L = [
  'Kamu tau gak bedanya kamu sama kopi? Kopi bikin melek, kamu bikin aku susah tidur ☕',
  'Bukan jam yang bikin aku telat, tapi mikirin kamu 🕰️',
  'Kamu pasti WiFi ya? Soalnya tiap deket kamu, aku langsung connect 📶',
  'Kalau kamu jadi soal ujian, aku rela remedial berkali-kali 📝',
  'Hari ini cerah, tapi gak secerah senyum kamu ☀️',
  'Aku bukan fotografer, tapi aku bisa bayangin kita berdua di satu frame 📸',
  'Kamu itu kayak password: susah ditebak, tapi aku gak mau ganti 🔐',
  'Apa kamu punya peta? Aku tersesat di matamu 🗺️',
  'Kamu pasti pajak ya, soalnya gak bisa aku hindari 💸',
  'Kalau cinta itu bug, aku gak mau di-fix kalau itu soal kamu 🐛'
]
module.exports = {
  name: 'rizz', command: ['rizz', 'pickup', 'gombalan2'], category: 'fun', emoji: '😏', desc: 'Kata-kata rayuan receh', usage: '',
  run: async ({ reply }) => reply(`😏 *RIZZ MODE*\n\n${pick(L)}\n\n_Dipakai dengan bijak ya!_`)
}
