const { getUser, rp } = require('../../lib/game')

module.exports = {
  name: 'balance',
  command: ['balance', 'bal', 'saldo', 'dompet'],
  category: 'game',
  desc: 'Cek money & saldo bank',
  run: async ({ sender, reply }) => {
    const u = getUser(sender)
    await reply(`*DOMPET*\n\n▬ *Money:* ${rp(u.money)}\n▬ *Bank:* ${rp(u.bank)}\n▬ *Total:* ${rp(u.money + u.bank)}`)
  }
}
