const { getUser, save, rp, pick } = require('../../lib/game')
const { btn } = require('../../lib/interactive')
const { sendGame, createSessions } = require('../../lib/richgame')
const { userOf } = require('../../lib/utils')

const RIDDLES = [
  ['Punya kepala dan ekor, tapi tidak punya badan. Apa itu?', 'Koin'],
  ['Makin diambil makin besar. Apa itu?', 'Lubang'],
  ['Bisa pecah tanpa disentuh. Apa itu?', 'Janji'],
  ['Bisa bicara dalam semua bahasa tanpa belajar. Apa itu?', 'Gema (echo)'],
  ['Makin banyak kamu ambil, makin banyak yang kamu tinggalkan. Apa itu?', 'Jejak kaki'],
  ['Punya kota tapi tak ada rumah, punya sungai tapi tak ada air. Apa itu?', 'Peta'],
  ['Selalu naik tapi tidak pernah turun. Apa itu?', 'Umur'],
  ['Punya leher tapi tidak punya kepala. Apa itu?', 'Botol'],
  ['Basah saat mengeringkan sesuatu. Apa itu?', 'Handuk'],
  ['Punya banyak tuts tapi tidak bisa membuka pintu. Apa itu?', 'Piano'],
  ['Selalu datang tapi tidak pernah tiba. Apa itu?', 'Besok'],
  ['Punya tangan tapi tidak bisa bertepuk tangan. Apa itu?', 'Jam'],
  ['Punya mata tapi tidak bisa melihat. Apa itu?', 'Jarum'],
  ['Makin lama menyala, makin pendek. Apa itu?', 'Lilin'],
  ['Apa yang ada di tengah-tengah kata "PARIS"?', 'Huruf R'],
  ['Punya empat kaki tapi tidak bisa berjalan. Apa itu?', 'Meja'],
  ['Tidak bisa dipegang tapi bisa dipatahkan. Apa itu?', 'Hati']
]

const sessions = createSessions(10 * 60 * 1000)

module.exports = {
  name: 'tebakan',
  command: ['tebakan', 'tebaktebakan', 'riddle'],
  category: 'game',
  desc: 'Tebak-tebakan receh, jawaban dibuka dengan tombol',
  usage: '[jawab]',
  run: async (ctx) => {
    const { from, sender, args, prefix, reply } = ctx
    const s = sessions.get(from)

    if ((args[0] || '').toLowerCase() === 'jawab') {
      if (!s) return reply(`Belum ada tebakan. Mulai dengan ${prefix}tebakan`)
      sessions.del(from)
      const u = getUser(sender)
      u.money += 500
      save()
      return sendGame(ctx, {
        body: `💡 *JAWABAN*\n\n${s.q}\n\n➡️ *${s.a}*\n\n@${userOf(sender)} +${rp(500)} karena penasaran 😄`,
        mentions: [sender],
        buttons: [btn.reply('🔁 Tebakan lain', `${prefix}tebakan`)]
      })
    }

    const [q, a] = pick(RIDDLES)
    sessions.set(from, { q, a })
    await sendGame(ctx, {
      body: `🤔 *TEBAK-TEBAKAN*\n\n${q}\n\nBalas dengan jawabanmu, lalu tekan tombol untuk melihat jawaban.`,
      buttons: [btn.reply('💡 Lihat jawaban', `${prefix}tebakan jawab`), btn.reply('⏭️ Ganti', `${prefix}tebakan`)]
    })
  }
}
