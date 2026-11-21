const { pick } = require('../../lib/game')

const LIST = [
  'Pergi ke pasar membeli ikan,\nIkan dibeli dibawa pulang.\nBelajar sungguh jangan bermalasan,\nMasa depan cerah menjelang.',
  'Anak ayam turun sepuluh,\nMati satu tinggal sembilan.\nJangan lekas hati mengeluh,\nSetiap masalah ada jalan.',
  'Kalau ada sumur di ladang,\nBolehlah kita menumpang mandi.\nKalau ada umurku panjang,\nBolehlah kita berjumpa lagi.',
  'Pisang emas dibawa berlayar,\nMasak sebiji di atas peti.\nUtang emas boleh dibayar,\nUtang budi dibawa mati.',
  'Berakit-rakit ke hulu,\nBerenang-renang ke tepian.\nBersakit-sakit dahulu,\nBersenang-senang kemudian.',
  'Jalan-jalan ke kota Medan,\nSinggah sebentar membeli duku.\nSemangat terus dalam perjuangan,\nHasil manis menunggumu.',
  'Buah salak buah kedondong,\nDimakan siang di bawah pohon.\nJangan malu bertanya kawan,\nIlmu bertambah hati pun senang.',
  'Menanam padi di tepi kali,\nMenuai hasil di musim kemarau.\nJangan berhenti mencoba lagi,\nKegagalan guru yang paling handal.'
]

module.exports = {
  name: 'pantun',
  command: ['pantun'],
  category: 'fun',
  desc: 'Pantun acak',
  run: async ({ reply }) => reply(`📜 *PANTUN*\n\n${pick(LIST)}`)
}
