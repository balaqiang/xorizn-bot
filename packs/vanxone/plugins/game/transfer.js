const { getUser, save, rp, parseAmount } = require('../../lib/game')
const { getTargets, isBot, sameUser, userOf } = require('../../lib/utils')

module.exports = {
  name: 'transfer',
  command: ['transfer', 'tf'],
  category: 'game',
  desc: 'Kirim money ke member lain',
  usage: '@user <jumlah>',
  run: async ({ sock, msg, from, sender, args, prefix, reply }) => {
    const amount = parseAmount(args[args.length - 1], 0)
    const target = getTargets(msg, args.slice(0, -1)).find((j) => !isBot(sock, j))
    if (!target || !amount) {
      return reply(`Tag atau reply member, lalu isi jumlah.\nContoh: ${prefix}transfer @user 5000`)
    }
    if (sameUser(target, sender)) return reply('Tidak bisa transfer ke diri sendiri.')

    const me = getUser(sender)
    if (amount > me.money) return reply(`Money kamu tidak cukup. Money: ${rp(me.money)}`)

    const to = getUser(target)
    me.money -= amount
    to.money += amount
    save()
    await sock.sendMessage(
      from,
      { text: `Transfer ${rp(amount)} ke @${userOf(target)} berhasil.\nSisa money: ${rp(me.money)}`, mentions: [target] },
      { quoted: msg }
    )
  }
}
