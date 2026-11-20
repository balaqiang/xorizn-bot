const { rp, parseAmount } = require('../../lib/game')

module.exports = {
  name: 'cicilan',
  command: ['cicilan', 'kredit', 'pinjaman'],
  category: 'tools',
  desc: 'Simulasi cicilan: flat & anuitas (efektif)',
  usage: '<pokok> <bunga%/tahun> <tenor bulan>',
  run: async ({ args, prefix, reply }) => {
    const P = parseAmount(args[0], null)
    const rate = Number(String(args[1] || '').replace('%', '').replace(',', '.'))
    const n = parseInt(args[2], 10)
    if (!P || !(rate >= 0 && rate <= 100) || !(n >= 1 && n <= 360)) {
      return reply(`Format: ${prefix}cicilan <pokok> <bunga%/tahun> <bulan>\nContoh: ${prefix}cicilan 10jt 12 12`)
    }
    const flatMonthly = (P + P * (rate / 100) * (n / 12)) / n
    const r = rate / 100 / 12
    const anuMonthly = r === 0 ? P / n : (P * r) / (1 - Math.pow(1 + r, -n))
    await reply(
      [
        '🏦 *SIMULASI CICILAN*',
        '',
        `▬ *Pokok:* ${rp(P)}`,
        `▬ *Bunga:* ${rate}% / tahun`,
        `▬ *Tenor:* ${n} bulan`,
        '',
        '*Bunga flat*',
        `• Cicilan/bulan: ${rp(Math.round(flatMonthly))}`,
        `• Total bayar: ${rp(Math.round(flatMonthly * n))}`,
        '',
        '*Bunga efektif (anuitas)*',
        `• Cicilan/bulan: ${rp(Math.round(anuMonthly))}`,
        `• Total bayar: ${rp(Math.round(anuMonthly * n))}`,
        '',
        '_Simulasi kasar; biaya admin & asuransi belum termasuk._'
      ].join('\n')
    )
  }
}
