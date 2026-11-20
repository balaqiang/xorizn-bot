const { getUser, save, rp, pick } = require('../../lib/game')
const { btn } = require('../../lib/interactive')
const { sendGame, parseBet } = require('../../lib/richgame')

const SIDES = { kepala: '🙂 Kepala', ekor: '🪙 Ekor' }

module.exports = {
  name: 'cf',
  command: ['cf', 'coinflip', 'lemparkoin'],
  category: 'game',
  desc: 'Tebak kepala/ekor dengan taruhan (menang x2)',
  usage: '<taruhan>',
  run: async (ctx) => {
    const { sender, args, prefix, reply } = ctx
    const first = (args[0] || '').toLowerCase()
    const picked = SIDES[first] ? first : null
    const rawBet = picked ? args[1] : args[0]

    const u = getUser(sender)
    const { bet, error } = parseBet(rawBet, u)
    if (error) return reply(`${error}\nContoh: ${prefix}cf 5000`)

    const buttons = [
      btn.reply(SIDES.kepala, `${prefix}cf kepala ${bet}`),
      btn.reply(SIDES.ekor, `${prefix}cf ekor ${bet}`)
    ]

    if (!picked) {
      return sendGame(ctx, {
        body: `🪙 *COIN FLIP*\n\nTaruhan: ${rp(bet)}\nMenang = x2. Pilih sisi koin!`,
        buttons
      })
    }

    const result = pick(['kepala', 'ekor'])
    const win = result === picked
    u.money += win ? bet : -bet
    save()

    await sendGame(ctx, {
      body: [
        '🪙 *COIN FLIP*',
        '',
        `Pilihanmu : ${SIDES[picked]}`,
        `Hasil     : ${SIDES[result]}`,
        '',
        win ? `🎉 Menang! +${rp(bet)}` : `💀 Kalah. -${rp(bet)}`,
        `Money: ${rp(u.money)}`
      ].join('\n'),
      buttons: [btn.reply(`🔁 Lagi ${rp(bet)}`, `${prefix}cf ${bet}`), ...buttons]
    })
  }
}
