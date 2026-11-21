const { getUser, save, rp, pick, parseAmount } = require('../../lib/game')
const { btn } = require('../../lib/interactive')
const { sendGame } = require('../../lib/richgame')

const SYMBOLS = ['🍒', '🍋', '🍇', '🔔', '💎']

module.exports = {
  name: 'slot',
  command: ['slot'],
  category: 'game',
  desc: 'Judi slot (3 sama = x5)',
  usage: '<taruhan|all>',
  run: async (ctx) => {
    const { sender, args, prefix, reply } = ctx
    const u = getUser(sender)
    const bet = parseAmount(args[0], u.money)
    if (!bet || bet < 100) return reply(`Taruhan minimal Rp100.\nContoh: ${prefix}slot 5000 atau ${prefix}slot all`)
    if (bet > u.money) return reply(`Money kamu tidak cukup. Money: ${rp(u.money)}`)

    const reels = [pick(SYMBOLS), pick(SYMBOLS), pick(SYMBOLS)]
    const unique = new Set(reels).size
    let change
    let label
    if (unique === 1) {
      change = bet * 4
      label = 'JACKPOT!'
    } else if (unique === 2) {
      change = Math.floor(bet * 0.5)
      label = 'Dapat sepasang.'
    } else {
      change = -bet
      label = 'Kalah.'
    }

    u.money += change
    save()
    const next = Math.min(bet * 2, Math.max(u.money, 0))
    const buttons = [btn.reply(`🔁 Putar lagi ${rp(bet)}`, `${prefix}slot ${bet}`)]
    if (next > bet) buttons.push(btn.reply(`⏫ x2 (${rp(next)})`, `${prefix}slot ${next}`))
    buttons.push(btn.reply('💰 Saldo', `${prefix}balance`))
    await sendGame(ctx, {
      body: `🎰 *SLOT*\n\n[ ${reels.join(' | ')} ]\n\n${label} ${change >= 0 ? '+' : '-'}${rp(Math.abs(change))}\nMoney: ${rp(u.money)}`,
      buttons
    })
  }
}
