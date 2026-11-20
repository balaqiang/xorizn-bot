const { pick } = require('../../lib/game')

const LIST = [
  'Kirim voice note nyanyi satu bait lagu favoritmu.',
  'Ganti foto profil jadi meme selama 1 jam.',
  'Kirim selfie dengan ekspresi paling jelek.',
  'Kirim stiker paling random yang kamu punya ke grup ini.',
  'Ceritakan lelucon yang menurutmu paling lucu.',
  'Kirim voice note pakai suara karakter kartun.',
  'Push up 10 kali lalu kirim buktinya.',
  'Tirukan gaya bicara salah satu member grup lewat voice note.',
  'Tulis status WhatsApp "aku fans berat bot vanXone" selama 1 jam.',
  'Kirim foto benda terdekat dari tempatmu duduk sekarang.'
]

module.exports = {
  list: LIST,
  name: 'dare',
  command: ['dare', 'tantangan'],
  category: 'fun',
  desc: 'Tantangan dare',
  run: async ({ reply }) => reply(`*DARE*\n\n${pick(LIST)}`)
}
