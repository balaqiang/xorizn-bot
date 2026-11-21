const { getUser, save, rp, rand } = require('../../lib/game')

const games = new Map() // jid chat -> { n, left, at }
const EXPIRE = 10 * 60 * 1000

module.exports = {
  name: 'tebakangka',
  command: ['tebakangka', 'tebak'],
  category: 'fun',
  desc: 'Tebak angka 1-100 (7 kesempatan, menang dapat money)',
  usage: '[angka]',
  run: async ({ from, sender, command, args, prefix, reply }) => {
    let g = games.get(from)
    if (g && Date.now() - g.at > EXPIRE) {
      games.delete(from)
      g = null
    }

    if (command === 'tebakangka') {
      if (g) return reply(`Game masih berjalan. Tebak dengan ${prefix}tebak <angka>`)
      games.set(from, { n: rand(1, 100), left: 7, at: Date.now() })
      return reply(`Aku memilih angka 1-100. Kamu punya 7 kesempatan.\nTebak dengan ${prefix}tebak <angka>`)
    }

    if (!g) return reply(`Belum ada game. Mulai dengan ${prefix}tebakangka`)
    const guess = Number(args[0])
    if (!Number.isInteger(guess) || guess < 1 || guess > 100) return reply('Masukkan angka 1-100.')

    g.left--
    if (guess === g.n) {
      const reward = 5000 * (g.left + 1)
      games.delete(from)
      const u = getUser(sender)
      u.money += reward
      save()
      return reply(`Benar! Angkanya ${g.n}. Hadiah ${rp(reward)}.`)
    }
    if (g.left <= 0) {
      games.delete(from)
      return reply(`Kesempatan habis. Angkanya ${g.n}.`)
    }
    await reply(`${guess < g.n ? 'Terlalu kecil' : 'Terlalu besar'}. Sisa ${g.left} kesempatan.`)
  }
}
