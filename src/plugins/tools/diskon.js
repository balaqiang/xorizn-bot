const { rp, parseAmount } = require('../../lib/game')

module.exports = {
  name: 'diskon',
  command: ['diskon', 'discount'],
  category: 'tools',
  desc: 'Hitung harga setelah diskon (bisa diskon bertingkat)',
  usage: '<harga> <diskon%> [diskon2%]',
  run: async ({ args, prefix, reply }) => {
    const price = parseAmount(args[0], null)
    const percents = args.slice(1).map((a) => Number(String(a).replace('%', '').replace(',', '.')))
    if (!price || !percents.length || percents.some((p) => !(p >= 0 && p <= 100))) {
      return reply(`Format: ${prefix}diskon <harga> <diskon%> [diskon2%]\nContoh: ${prefix}diskon 250000 30\nBertingkat: ${prefix}diskon 1jt 20 10`)
    }
    let final = price
    const steps = percents.map((p) => {
      const cut = final * (p / 100)
      final -= cut
      return `• Diskon ${p}% : -${rp(cut)} → ${rp(final)}`
    })
    const saved = price - final
    await reply(
      ['*KALKULATOR DISKON*', '', `▬ *Harga awal:* ${rp(price)}`, ...steps, '', `▬ *Harga akhir:* ${rp(final)}`, `▬ *Hemat:* ${rp(saved)} (${((saved / price) * 100).toFixed(1)}%)`].join('\n')
    )
  }
}
