const { pick, rand, shuffle } = require('../../lib/fx')
const CARDS = [
  ['The Fool', '🃏', 'Awal baru & keberanian. Berani melangkah meski belum siap sepenuhnya.'],
  ['The Magician', '🪄', 'Kamu punya semua alat yang dibutuhkan. Saatnya eksekusi.'],
  ['The High Priestess', '🌙', 'Dengarkan intuisi. Jawabannya sudah ada di dalam.'],
  ['The Empress', '🌸', 'Kelimpahan & kasih sayang. Rawat apa yang kamu tanam.'],
  ['The Emperor', '👑', 'Disiplin & struktur membawa stabilitas.'],
  ['The Lovers', '💞', 'Pilihan penting soal hubungan atau nilai hidup.'],
  ['The Chariot', '🏇', 'Tekad kuat. Fokus pada tujuan, kemenangan dekat.'],
  ['Strength', '🦁', 'Kekuatan lembut. Sabar mengalahkan emosi.'],
  ['The Hermit', '🕯️', 'Waktunya menyendiri & refleksi.'],
  ['Wheel of Fortune', '🎡', 'Nasib berputar. Perubahan akan datang.'],
  ['Justice', '⚖️', 'Keadilan & konsekuensi. Bertindaklah jujur.'],
  ['The Star', '⭐', 'Harapan & pemulihan. Setelah gelap datang terang.'],
  ['The Sun', '☀️', 'Kebahagiaan, sukses, dan energi positif.'],
  ['The Moon', '🌕', 'Ada hal yang belum jelas. Jangan buru-buru memutuskan.'],
  ['Temperance', '🧪', 'Keseimbangan. Jalan tengah adalah yang terbaik.'],
  ['The World', '🌍', 'Penyelesaian & pencapaian. Satu siklus selesai.']
]
module.exports = {
  name: 'tarot', command: ['tarot', 'kartutarot'], category: 'fun', emoji: '🔮', desc: 'Tarik kartu tarot: 1 kartu atau 3 kartu (masa lalu-kini-depan)', usage: '[3]',
  run: async ({ args, reply }) => {
    const three = ['3', 'tiga'].includes((args[0] || '').toLowerCase())
    const deck = shuffle(CARDS)
    const pos = three ? ['⏮️ Masa Lalu', '⏺️ Saat Ini', '⏭️ Masa Depan'] : ['🎴 Kartumu']
    const lines = pos.map((p, i) => {
      const [n, e, m] = deck[i]
      const rev = Math.random() < 0.3
      return `*${p}*\n${e} *${n}*${rev ? ' (terbalik)' : ''}\n_${rev ? 'Waspada: ' : ''}${m}_`
    })
    await reply(`🔮 *TAROT READING*\n\n${lines.join('\n\n')}\n\n_Hanya hiburan & bahan renungan._`)
  }
}
