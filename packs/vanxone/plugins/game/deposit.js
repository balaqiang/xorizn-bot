const { getUser, save, rp, parseAmount } = require('../../lib/game')

module.exports = {
  name: 'deposit',
  command: ['deposit', 'dep'],
  category: 'game',
  desc: 'Simpan money ke bank',
  usage: '<jumlah|all>',
  run: async ({ sender, args, prefix, reply }) => {
    const u = getUser(sender)
    const amount = parseAmount(args[0], u.money)
    if (!amount) return reply(`Masukkan jumlah.\nContoh: ${prefix}deposit 10000 atau ${prefix}deposit all`)
    if (amount > u.money) return reply(`Money kamu tidak cukup. Money: ${rp(u.money)}`)

    u.money -= amount
    u.bank += amount
    save()
    await reply(`Berhasil menyimpan ${rp(amount)} ke bank.\n▬ Money: ${rp(u.money)}\n▬ Bank: ${rp(u.bank)}`)
  }
}
