const { getUser, save, rp, pick } = require('../../lib/game')
const { btn } = require('../../lib/interactive')
const { sendGame, parseBet } = require('../../lib/richgame')

const CHOICES = ['batu', 'gunting', 'kertas']
const ICON = { batu: '✊', gunting: '✌️', kertas: '🖐️' }
const BEATS = { batu: 'gunting', gunting: 'kertas', kertas: 'batu' }

module.exports = {
  name: 'rps',
  command: ['rps', 'suitrich'],
  category: 'game',
  desc: 'Batu-gunting-kertas lawan bot pakai tombol (taruhan opsional)',
  usage: '[taruhan]',
  run: async (ctx) => {
    const { sender, args, prefix, reply } = ctx
    const first = (args[0] || '').toLowerCase()
    const playing = CHOICES.includes(first)
    const rawBet = playing ? args[1] : args[0]

    const u = getUser(sender)
    const { bet, error } = parseBet(rawBet, u, { optional: true })
    if (error) return reply(error)
    const betArg = bet ? ` ${bet}` : ''

    const choiceButtons = CHOICES.map((c) => btn.reply(`${ICON[c]} ${c[0].toUpperCase()}${c.slice(1)}`, `${prefix}rps ${c}${betArg}`))

    if (!playing) {
      return sendGame(ctx, {
        body: `✊✌️🖐️ *BATU GUNTING KERTAS*\n\nTaruhan: ${bet ? rp(bet) : 'tanpa taruhan'}\nPilih senjatamu!`,
        buttons: choiceButtons
      })
    }

    const mine = first
    const bot = pick(CHOICES)
    let result
    if (mine === bot) result = '🤝 Seri.'
    else if (BEATS[mine] === bot) {
      u.money += bet
      result = bet ? `🎉 Kamu menang! +${rp(bet)}` : '🎉 Kamu menang!'
    } else {
      u.money -= bet
      result = bet ? `💀 Kamu kalah. -${rp(bet)}` : '💀 Kamu kalah.'
    }
    save()

    await sendGame(ctx, {
      body: [
        '✊✌️🖐️ *BATU GUNTING KERTAS*',
        '',
        `Kamu : ${ICON[mine]} ${mine}`,
        `Bot  : ${ICON[bot]} ${bot}`,
        '',
        result,
        bet && `Money: ${rp(u.money)}`
      ]
        .filter((l) => l !== 0 && l !== false && l !== undefined)
        .join('\n'),
      buttons: choiceButtons
    })
  }
}
