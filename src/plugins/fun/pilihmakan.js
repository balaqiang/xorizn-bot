const { pick, shuffle } = require('../../lib/fx')
const FOOD = { berat: ['Nasi Padang', 'Nasi Goreng Spesial', 'Ayam Geprek', 'Rawon', 'Soto Ayam', 'Gado-gado', 'Bakso Urat', 'Mie Ayam', 'Nasi Uduk', 'Sate Ayam', 'Pecel Lele', 'Rendang', 'Nasi Liwet', 'Gudeg', 'Coto Makassar'], ringan: ['Roti Bakar', 'Batagor', 'Siomay', 'Martabak Mini', 'Pisang Goreng', 'Bubur Ayam', 'Lontong Sayur', 'Cilok', 'Kentang Goreng', 'Dimsum'], minum: ['Es Teh Manis', 'Kopi Susu', 'Boba', 'Es Jeruk', 'Matcha Latte', 'Wedang Jahe', 'Es Campur', 'Jus Alpukat', 'Teh Tarik', 'Coklat Panas'] }
module.exports = {
  name: 'pilihmakan', command: ['pilihmakan', 'makanapa', 'laper'], category: 'fun', emoji: '🍽️', desc: 'Bingung makan apa? Biar bot yang pilih', usage: '[berat|ringan|minum]',
  run: async ({ args, reply }) => {
    const k = (args[0] || '').toLowerCase()
    const m = FOOD[k] ? pick(FOOD[k]) : pick(FOOD.berat)
    const alt = shuffle([...FOOD.berat, ...FOOD.ringan]).filter((x) => x !== m).slice(0, 2)
    await reply(`🍽️ *MAKAN APA HARI INI?*\n\n🎯 *${m}*\n🥤 Minumnya: *${pick(FOOD.minum)}*\n\nCadangan: ${alt.join(' / ')}\n_Kategori: berat, ringan, minum_`)
  }
}
