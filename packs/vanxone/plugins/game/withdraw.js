const { getUser, save, rp, parseAmount } = require('../../lib/game')

module.exports = {
  name: 'withdraw',
  command: ['withdraw', 'wd', 'tarik'],
  category: 'game',
  desc: 'Tarik money dari bank',
  usage: '<jumlah|all>',
  run: async ({ sender, args, prefix, reply }) => {
    const u = getUser(sender)
    const amount = parseAmount(args[0], u.bank)
    if (!amount) return reply(`Masukkan jumlah.\nContoh: ${prefix}withdraw 10000 atau ${prefix}withdraw all`)
    if (amount > u.bank) return reply(`Saldo bank tidak cukup. Bank: ${rp(u.bank)}`)

    u.bank -= amount
    u.money += amount
    save()
    await reply(`Berhasil menarik ${rp(amount)} dari bank.\n▬ Money: ${rp(u.money)}\n▬ Bank: ${rp(u.bank)}`)
  }
}
