const { getUser, save, rp, pick, parseAmount } = require('../../lib/game')

const CHOICES = ['batu', 'gunting', 'kertas']
const BEATS = { batu: 'gunting', gunting: 'kertas', kertas: 'batu' }

module.exports = {
  name: 'suit',
  command: ['suit'],
  category: 'game',
  desc: 'Suit lawan bot (taruhan opsional)',
  usage: 'batu|gunting|kertas [taruhan]',
  run: async ({ sender, args, prefix, reply }) => {
    const mine = (args[0] || '').toLowerCase()
    if (!CHOICES.includes(mine)) return reply(`Pilih batu, gunting, atau kertas.\nContoh: ${prefix}suit batu 5000`)

    const u = getUser(sender)
    const bet = args[1] ? parseAmount(args[1], u.money) : 0
    if (args[1] && (!bet || bet < 100)) return reply('Taruhan minimal Rp100.')
    if (bet > u.money) return reply(`Money kamu tidak cukup. Money: ${rp(u.money)}`)

    const bot = pick(CHOICES)
    let result
    if (mine === bot) result = 'Seri.'
    else if (BEATS[mine] === bot) {
      result = bet ? `Kamu menang! +${rp(bet)}` : 'Kamu menang!'
      u.money += bet
    } else {
      result = bet ? `Kamu kalah. -${rp(bet)}` : 'Kamu kalah.'
      u.money -= bet
    }
    save()
    await reply(`Kamu: *${mine}*\nBot: *${bot}*\n\n${result}${bet ? `\nMoney: ${rp(u.money)}` : ''}`)
  }
}
