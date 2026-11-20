const { rp, parseAmount } = require('../../lib/game')

module.exports = {
  name: 'patungan',
  command: ['patungan', 'splitbill', 'bagi'],
  category: 'tools',
  desc: 'Bagi tagihan rata (opsional pajak & tip %)',
  usage: '<total> <jumlah orang> [pajak%] [tip%]',
  run: async ({ args, prefix, reply }) => {
    const total = parseAmount(args[0], null)
    const people = parseInt(args[1], 10)
    const tax = Number(args[2] ?? 0)
    const tip = Number(args[3] ?? 0)
    if (!total || !(people >= 1 && people <= 500) || !(tax >= 0 && tax <= 100) || !(tip >= 0 && tip <= 100)) {
      return reply(`Format: ${prefix}patungan <total> <orang> [pajak%] [tip%]\nContoh: ${prefix}patungan 450rb 5 10`)
    }
    const grand = Math.round(total * (1 + tax / 100) * (1 + tip / 100)) // bulatkan dulu agar tidak kena selisih desimal
    const each = Math.ceil(grand / people / 100) * 100 // dibulatkan ke atas per Rp100
    await reply(
      [
        '🧾 *PATUNGAN*',
        '',
        `▬ *Tagihan:* ${rp(total)}`,
        tax ? `▬ *Pajak ${tax}%:* ${rp(Math.round(total * tax / 100))}` : null,
        tip ? `▬ *Tip ${tip}%:* ${rp(Math.round(total * (1 + tax / 100) * tip / 100))}` : null,
        `▬ *Total:* ${rp(grand)}`,
        `▬ *Orang:* ${people}`,
        '',
        `💸 *Per orang: ${rp(each)}*`,
        '_dibulatkan ke atas per Rp100_'
      ].filter((l) => l !== null).join('\n')
    )
  }
}
