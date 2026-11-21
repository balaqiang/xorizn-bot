const { pick } = require('../../lib/game')

const LIST = [
  ['Kenapa programmer suka gelap?', 'Karena light attracts bugs.'],
  ['Kenapa komputer nggak pernah kedinginan?', 'Karena punya banyak Windows... tapi sering hang.'],
  ['Ikan apa yang nggak bisa berenang?', 'Ikan di dalam kaleng.'],
  ['Kenapa kalender nggak pernah sepi?', 'Karena tanggalnya banyak yang ngajak kencan.'],
  ['Kenapa ayam menyeberang jalan?', 'Karena ada yang jualan di seberang.'],
  ['Buah apa yang paling jujur?', 'Semangka, karena isinya kelihatan semua.'],
  ['Kenapa kopi nggak pernah dapat juara?', 'Karena selalu diseruput di babak awal.'],
  ['Kenapa sepeda nggak bisa berdiri sendiri?', 'Karena dua-tired (too tired).'],
  ['Apa bedanya jomblo dan WiFi gratis?', 'Sama-sama banyak yang mau, tapi sering nggak ada yang bertahan.'],
  ['Kenapa uang receh suka bunyi?', 'Karena nggak mau diremehkan.'],
  ['Hewan apa yang paling disiplin?', 'Semut, jalannya selalu baris.'],
  ['Kenapa pensil lebih pintar dari bolpen?', 'Karena bisa dihapus kesalahannya.']
]

module.exports = {
  name: 'jokes',
  command: ['jokes', 'receh', 'lawak'],
  category: 'fun',
  desc: 'Jokes receh acak',
  run: async ({ reply }) => {
    const [q, a] = pick(LIST)
    await reply(`😆 *JOKES RECEH*\n\n${q}\n\n➡️ ${a}`)
  }
}
