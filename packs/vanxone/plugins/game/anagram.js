const { shuffle, pick } = require('../../lib/fx')
const { getUser, save } = require('../../lib/db')
const W = ['komputer', 'sekolah', 'bahagia', 'perpustakaan', 'indonesia', 'matahari', 'keluarga', 'petualang', 'makanan', 'telepon', 'pelangi', 'universitas', 'pesawat', 'gunung', 'kebudayaan', 'olahraga', 'internet', 'sahabat', 'kemerdekaan', 'jendela']
const games = new Map() // chat -> {word, exp}
module.exports = {
  name: 'anagram', command: ['anagram', 'acakkata'], category: 'game', emoji: '🔠', desc: 'Susun huruf acak jadi kata. Jawab dengan .anagram <jawaban>', usage: '[jawaban]',
  run: async ({ from, sender, args, prefix, reply }) => {
    const g = games.get(from)
    if (g && Date.now() > g.exp) games.delete(from)
    if (args.length && games.has(from)) {
      const cur = games.get(from)
      if (args.join('').toLowerCase() === cur.word) {
        games.delete(from)
        const u = getUser(sender); const win = 5000 + cur.word.length * 1000; u.money += win; u.exp += 500; save()
        return reply(`✅ *Benar!* Kata: *${cur.word}*\n▬ *Hadiah:* Rp${win.toLocaleString('id-ID')}\n▬ *EXP:* +500`)
      }
      return reply('❌ Belum tepat, coba lagi!')
    }
    const word = pick(W)
    let scr = word
    for (let i = 0; i < 6 && scr === word; i++) scr = shuffle([...word]).join('')
    games.set(from, { word, exp: Date.now() + 120000 })
    await reply(`🔠 *ANAGRAM*\n\nSusun huruf ini jadi kata:\n『 *${scr.toUpperCase().split('').join(' ')}* 』\n\n▬ *Petunjuk:* ${word.length} huruf, diawali "${word[0].toUpperCase()}"\n_Jawab dengan ${prefix}anagram <jawaban> dalam 2 menit._`)
  }
}
