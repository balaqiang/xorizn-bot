const { getUser, save, rp, pick } = require('../../lib/game')
const Q = [['🦁👑', 'raja hutan'], ['🌧️☂️', 'payung'], ['🍚🍗', 'nasi ayam'], ['📚🎓', 'sekolah'], ['🌙⭐', 'malam'], ['🐟🎣', 'memancing'], ['🔥🍜', 'mie pedas'], ['🚗⛽', 'bensin'], ['☕📖', 'kopi'], ['🏠❤️', 'rumah'], ['🌊🏄', 'selancar'], ['🎂🎈', 'ulang tahun'], ['🕌🌙', 'ramadan'], ['✈️🌏', 'liburan'], ['🐱🐟', 'kucing'], ['💡🧠', 'ide'], ['🎵🎤', 'karaoke'], ['⚽🥅', 'sepak bola'], ['🌋🔥', 'gunung berapi'], ['🍕🧀', 'pizza']]
const g = new Map()
module.exports = {
  name: 'tebakemoji', command: ['tebakemoji', 'emojiquiz'], category: 'game', emoji: '🤔', desc: 'Tebak arti rangkaian emoji (jawab dengan .tebakemoji <jawaban>)', usage: '[jawaban]',
  run: async ({ from, sender, args, prefix, reply }) => {
    const cur = g.get(from)
    if (cur && Date.now() > cur.exp) g.delete(from)
    if (args.length && g.has(from)) {
      const q = g.get(from)
      const a = args.join(' ').toLowerCase().trim()
      const ok = a === q.a || q.a.split(' ').includes(a) && a.length > 3
      if (!ok) return reply('❌ Belum tepat. Coba lagi!')
      g.delete(from); const u = getUser(sender); u.money += 6000; u.exp += 300; save()
      return reply(`✅ *Benar!* Jawaban: *${q.a}*\n▬ *Hadiah:* ${rp(6000)}`)
    }
    const [e, a] = pick(Q)
    g.set(from, { a, exp: Date.now() + 90000 })
    await reply(`🤔 *TEBAK EMOJI*\n\n『 ${e} 』\n\n▬ *Petunjuk:* ${a.length} huruf, awalan "${a[0]}"\n_Jawab: ${prefix}tebakemoji <jawaban> (90 detik)_`)
  }
}
