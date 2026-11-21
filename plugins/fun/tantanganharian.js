const { dayRand } = require('../../lib/fx')
const C = ['Minum 8 gelas air putih 💧', 'Jalan kaki 15 menit 🚶', 'Rapikan satu sudut kamar 🧹', 'Kirim pesan terima kasih ke seseorang 💌', 'Tidak main medsos selama 1 jam 📵', 'Baca 10 halaman buku 📚', 'Belajar 3 kata bahasa baru 🌐', 'Peregangan 5 menit 🧘', 'Tulis 3 hal yang kamu syukuri 🙏', 'Makan satu buah/sayur ekstra 🥗', 'Tidur sebelum jam 22.30 😴', 'Catat semua pengeluaran hari ini 🧾', 'Telepon keluarga 📞', 'Belajar skill baru 15 menit 🎯']
module.exports = {
  name: 'tantanganharian', command: ['tantanganharian', 'challenge', 'tantangan1'], category: 'fun', emoji: '🎯', desc: 'Tantangan kecil harian (berganti tiap hari)', usage: '',
  run: async ({ sender, reply }) => reply(`🎯 *TANTANGAN HARI INI*\n\n${C[dayRand('chal', 0, C.length - 1)]}\n${C[(dayRand('chal', 0, C.length - 1) + 5) % C.length].length ? `\n⭐ *Bonus:* ${C[(dayRand('chal', 0, C.length - 1) + 5) % C.length]}` : ''}\n\n_Selesaikan lalu catat di .habit supaya streak-mu terjaga!_`)
}
