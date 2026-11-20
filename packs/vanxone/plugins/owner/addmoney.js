const { getUser, save, rp, parseAmount } = require('../../lib/game')
const { getTargets, isBot } = require('../../lib/utils')

module.exports = {
  name: 'addmoney',
  command: ['addmoney'],
  category: 'owner',
  desc: 'Tambah money user',
  usage: '@user <jumlah>',
  owner: true,
  run: async ({ sock, msg, args, prefix, reply }) => {
    const amount = parseAmount(args[args.length - 1], 0)
    const target = getTargets(msg, args.slice(0, -1)).find((j) => !isBot(sock, j))
    if (!target || !amount) return reply(`Contoh: ${prefix}addmoney @user 100000`)

    const u = getUser(target)
    u.money += amount
    save()
    await reply(`Money ditambah ${rp(amount)}. Total sekarang ${rp(u.money)}.`)
  }
}
