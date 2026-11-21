const { pick } = require('../../lib/fx')
const WYR = [
  ['Gak bisa pegang HP seminggu', 'Gak bisa makan enak seminggu'], ['Bisa terbang', 'Bisa menghilang'], ['Selalu telat 10 menit', 'Selalu kecepetan 1 jam'],
  ['Kaya tapi kesepian', 'Biasa aja tapi dikelilingi orang tersayang'], ['Tau kapan meninggal', 'Tau cara meninggal'], ['Wifi lemot selamanya', 'Baterai HP cuma 20% selamanya'],
  ['Hidup di masa lalu', 'Hidup di masa depan'], ['Bisa baca pikiran', 'Bisa melihat masa depan'], ['Makan mie instan terus', 'Makan nasi putih tanpa lauk terus'],
  ['Selalu jujur', 'Selalu bisa berbohong tanpa ketahuan'], ['Libur 3 bulan tanpa uang', 'Kerja terus tapi gaji dobel'], ['Tinggal di pantai', 'Tinggal di gunung']
]
const NHIE = ['Tidur di kelas/kantor', 'Nyontek pas ujian', 'Lupa nama orang yang baru dikenalkan', 'Pura-pura gak lihat chat', 'Salah kirim chat ke orang yang dibicarakan', 'Nangis nonton film animasi', 'Telat bangun pas ada acara penting', 'Stalking mantan', 'Ngegas di jalan raya', 'Ketiduran pas telepon']
module.exports = {
  name: 'wyr', command: ['wyr', 'wouldyourather', 'pilihsatu', 'nhie', 'nevereverhave'], category: 'fun', emoji: '⚖️', desc: 'Would You Rather & Never Have I Ever', usage: '',
  run: async ({ command, reply }) => {
    if (['nhie', 'nevereverhave'].includes(command)) return reply(`🙋 *NEVER HAVE I EVER*\n\nAku belum pernah...\n➥ *${pick(NHIE)}*\n\n_Yang pernah, angkat tangan (balas "pernah")!_`)
    const [a, b] = pick(WYR)
    await reply(`⚖️ *WOULD YOU RATHER*\n\n🅰️ ${a}\n\n_atau_\n\n🅱️ ${b}\n\n_Balas A atau B dan jelaskan alasannya!_`)
  }
}
