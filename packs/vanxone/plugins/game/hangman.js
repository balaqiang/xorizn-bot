const { getUser, save, rp } = require('../../lib/game')
const { btn } = require('../../lib/interactive')
const { sendGame, createSessions } = require('../../lib/richgame')
const hm = require('../../lib/hangman')
const { userOf } = require('../../lib/utils')

const sessions = createSessions(10 * 60 * 1000)
const MAX_LIVES = 6
const REWARD = 8000
const hearts = (n) => '❤️'.repeat(n) + '🖤'.repeat(MAX_LIVES - n)

function board(s, note = '') {
  return [
    '🔤 *HANGMAN*',
    `Kategori: ${s.category}`,
    '',
    `*${hm.masked(s.word, s.guessed)}*`,
    '',
    `Nyawa: ${hearts(s.lives)}`,
    `Huruf salah: ${s.wrong.size ? [...s.wrong].join(' ').toUpperCase() : '-'}`,
    note && `\n${note}`,
    '',
    '_Tebak dengan mengetik_ `.hm <huruf>` _atau_ `.hm <kata lengkap>`'
  ].filter((l) => l !== '' || true).join('\n')
}

async function end(ctx, s, win, who) {
  const { prefix } = ctx
  sessions.del(ctx.from)
  let text = win ? `🎉 *BENAR!* Katanya: *${s.word.toUpperCase()}*` : `💀 *GAME OVER!* Katanya: *${s.word.toUpperCase()}*`
  const mentions = []
  if (win && who) {
    const u = getUser(who)
    u.money += REWARD
    save()
    text += `\n@${userOf(who)} mendapat ${rp(REWARD)}`
    mentions.push(who)
  }
  await sendGame(ctx, { body: `🔤 *HANGMAN*\n\n${text}`, mentions, buttons: [btn.reply('🔁 Main lagi', `${prefix}hm`)] })
}

module.exports = {
  name: 'hangman',
  command: ['hangman', 'hm', 'tebakkata'],
  category: 'game',
  desc: 'Tebak kata huruf demi huruf (6 nyawa)',
  usage: '<huruf|kata> | petunjuk | stop',
  run: async (ctx) => {
    const { from, sender, args, prefix, reply } = ctx
    const s = sessions.get(from)
    const arg = (args[0] || '').toLowerCase()

    if (!s) {
      if (arg === 'stop') return reply('Tidak ada permainan aktif.')
      const { category, word } = hm.randomWord()
      const state = sessions.set(from, { word, category, guessed: new Set(), wrong: new Set(), lives: MAX_LIVES })
      return sendGame(ctx, {
        body: board(state),
        buttons: [btn.reply('💡 Petunjuk (-1 nyawa)', `${prefix}hm petunjuk`), btn.reply('🏳️ Menyerah', `${prefix}hm stop`)]
      })
    }

    if (!arg) return sendGame(ctx, { body: board(s), buttons: [btn.reply('💡 Petunjuk (-1 nyawa)', `${prefix}hm petunjuk`), btn.reply('🏳️ Menyerah', `${prefix}hm stop`)] })
    if (arg === 'stop' || arg === 'nyerah') return end(ctx, s, false)

    if (arg === 'petunjuk' || arg === 'hint') {
      const hidden = [...new Set([...s.word])].filter((c) => !s.guessed.has(c))
      if (s.lives <= 1) return reply('Nyawa tinggal satu, petunjuk tidak bisa dipakai.')
      s.lives--
      s.guessed.add(hidden[Math.floor(Math.random() * hidden.length)])
      if (hm.solved(s.word, s.guessed)) return end(ctx, s, true, sender)
      sessions.touch(from)
      return sendGame(ctx, { body: board(s, '💡 Satu huruf dibuka.'), buttons: [btn.reply('💡 Petunjuk', `${prefix}hm petunjuk`), btn.reply('🏳️ Menyerah', `${prefix}hm stop`)] })
    }

    if (!/^[a-z]+$/.test(arg)) return reply('Tebak dengan huruf a-z atau kata lengkap tanpa spasi/angka.')

    if (arg.length > 1) {
      if (arg === s.word) return end(ctx, s, true, sender)
      s.lives--
      if (s.lives <= 0) return end(ctx, s, false)
      sessions.touch(from)
      return sendGame(ctx, { body: board(s, `❌ Bukan "${arg.toUpperCase()}".`), buttons: [btn.reply('💡 Petunjuk', `${prefix}hm petunjuk`)] })
    }

    if (s.guessed.has(arg) || s.wrong.has(arg)) return reply(`Huruf ${arg.toUpperCase()} sudah ditebak.`)
    let note
    if (s.word.includes(arg)) {
      s.guessed.add(arg)
      note = `✅ Ada huruf ${arg.toUpperCase()}!`
      if (hm.solved(s.word, s.guessed)) return end(ctx, s, true, sender)
    } else {
      s.wrong.add(arg)
      s.lives--
      note = `❌ Tidak ada huruf ${arg.toUpperCase()}.`
      if (s.lives <= 0) return end(ctx, s, false)
    }
    sessions.touch(from)
    await sendGame(ctx, { body: board(s, note), buttons: [btn.reply('💡 Petunjuk', `${prefix}hm petunjuk`), btn.reply('🏳️ Menyerah', `${prefix}hm stop`)] })
  }
}
