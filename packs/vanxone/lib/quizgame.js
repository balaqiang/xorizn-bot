// Mesin game pilihan ganda berbasis tombol (dipakai .kuis, .math, .tebakbendera)
const { btn } = require('./interactive')
const { sendGame } = require('./richgame')
const { getUser, save, rp } = require('./game')
const { userOf } = require('./utils')

const games = new Map() // `${chat}:${game}` -> sesi
const LETTERS = ['A', 'B', 'C', 'D']
const cut = (s, n) => (String(s).length > n ? `${String(s).slice(0, n - 1)}…` : String(s))
const keyOf = (from, game) => `${from}:${game}`

function active(from, game) {
  const g = games.get(keyOf(from, game))
  if (g && Date.now() > g.endsAt) {
    clearTimeout(g.timer)
    games.delete(keyOf(from, game))
    return null
  }
  return g || null
}

// q: { text, options[], correct, reward, ttl, again }  title: judul kartu  cmd: nama perintah untuk tombol
async function start(ctx, { game, cmd, title, q }) {
  const { sock, from, prefix, reply } = ctx
  if (active(from, game)) return reply(`Masih ada soal yang berjalan. Jawab dulu dengan tombol di soal sebelumnya.`)

  const key = keyOf(from, game)
  const g = {
    q,
    locked: new Set(),
    endsAt: Date.now() + q.ttl * 1000,
    timer: setTimeout(() => {
      if (games.get(key) !== g) return
      games.delete(key)
      sock
        .sendMessage(from, { text: `⏰ *WAKTU HABIS!*\nJawaban yang benar: *${LETTERS[q.correct]}. ${q.options[q.correct]}*` })
        .catch(() => {})
    }, q.ttl * 1000)
  }
  g.timer.unref?.()
  games.set(key, g)

  const body = [
    `${title}`,
    '',
    q.text,
    '',
    ...q.options.map((o, i) => `${LETTERS[i]}. ${o}`),
    '',
    `⏱️ ${q.ttl} detik  •  🎁 ${rp(q.reward)}`
  ].join('\n')

  await sendGame(ctx, {
    body,
    buttons: q.options.map((o, i) => btn.reply(`${LETTERS[i]}. ${cut(o, 20)}`, `${prefix}${cmd} jawab ${i}`))
  })
}

async function answer(ctx, { game, cmd, index }) {
  const { sock, msg, from, sender, isGroup, prefix, reply } = ctx
  const key = keyOf(from, game)
  const g = active(from, game)
  if (!g) return reply(`Soal ini sudah selesai. Mulai lagi dengan ${prefix}${cmd}`)
  if (!Number.isInteger(index) || index < 0 || index >= g.q.options.length) return reply('Pilihan tidak valid.')

  const who = userOf(sender)
  if (g.locked.has(who)) return reply('Kamu sudah menjawab salah di soal ini. Tunggu soal berikutnya.')

  const right = g.q.options[g.q.correct]
  if (index === g.q.correct) {
    clearTimeout(g.timer)
    games.delete(key)
    const u = getUser(sender)
    u.money += g.q.reward
    u.exp += 200
    save()
    await sock.sendMessage(
      from,
      { text: `✅ *BENAR!* @${who} menjawab *${LETTERS[g.q.correct]}. ${right}*\n🎁 +${rp(g.q.reward)}  •  Money: ${rp(u.money)}`, mentions: [sender] },
      { quoted: msg }
    )
    return sendGame(ctx, { body: 'Mau lanjut main?', buttons: [btn.reply('🔁 Soal berikutnya', `${prefix}${g.q.again || cmd}`)] })
  }

  g.locked.add(who)
  if (!isGroup) {
    clearTimeout(g.timer)
    games.delete(key)
    return sendGame(ctx, {
      body: `❌ *SALAH!*\nJawaban yang benar: *${LETTERS[g.q.correct]}. ${right}*`,
      buttons: [btn.reply('🔁 Coba lagi', `${prefix}${g.q.again || cmd}`)]
    })
  }
  await sock.sendMessage(from, { text: `❌ @${who} salah. Yang lain masih bisa menjawab!`, mentions: [sender] }, { quoted: msg })
}

module.exports = { start, answer }
