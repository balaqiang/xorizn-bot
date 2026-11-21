const dates = require('../../lib/dates')

module.exports = {
  name: 'hitungmundur',
  command: ['hitungmundur', 'countdown', 'berapahari'],
  category: 'tools',
  desc: 'Hitung berapa hari lagi / sejak sebuah tanggal',
  usage: '<tgl-bln-tahun>',
  run: async ({ args, prefix, reply }) => {
    const t = dates.parse(args.join(' '))
    if (!t) return reply(`Format: ${prefix}hitungmundur <tgl-bln-tahun>\nContoh: ${prefix}hitungmundur 17-08-2027`)
    const now = dates.todayWib()
    const diff = dates.days(now, t)
    const [a, b] = diff >= 0 ? [now, t] : [t, now]
    const x = dates.ymd(a, b)
    const detail = `${x.y ? `${x.y} tahun ` : ''}${x.m ? `${x.m} bulan ` : ''}${x.d || (!x.y && !x.m) ? `${x.d} hari` : ''}`.trim()
    await reply(
      [`⏳ *${dates.fmt(t)}*`, '', diff === 0 ? '🎉 Hari ini!' : diff > 0 ? `▬ *${diff} hari lagi*` : `▬ *${-diff} hari yang lalu*`, `▬ ${detail}`, diff !== 0 ? `▬ ≈ ${(Math.abs(diff) / 7).toFixed(1)} minggu` : ''].filter(Boolean).join('\n')
    )
  }
}
