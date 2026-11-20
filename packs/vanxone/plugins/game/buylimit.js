const { getUser, save, rp, parseAmount } = require('../../lib/game')

const PRICE = 5000

module.exports = {
  name: 'buylimit',
  command: ['buylimit', 'belilimit'],
  category: 'game',
  desc: `Beli limit (${rp(PRICE)} per limit)`,
  usage: '<jumlah>',
  run: async ({ sender, args, prefix, reply }) => {
    const u = getUser(sender)
    const qty = parseAmount(args[0], Math.floor(u.money / PRICE))
    if (!qty) return reply(`Limit kamu: ${u.limit}\nHarga: ${rp(PRICE)} per limit\nContoh: ${prefix}buylimit 10`)
    if (qty > 1000) return reply('Maksimal beli 1.000 limit sekali transaksi.')

    const cost = qty * PRICE
    if (u.money < cost) return reply(`Money tidak cukup. Butuh ${rp(cost)}, kamu punya ${rp(u.money)}.`)
    u.money -= cost
    u.limit += qty
    save()
    await reply(`Berhasil membeli ${qty} limit seharga ${rp(cost)}.\nLimit sekarang: ${u.limit}`)
  }
}
