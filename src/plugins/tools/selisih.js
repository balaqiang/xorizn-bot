const dates = require('../../lib/dates')

module.exports = {
  name: 'selisih',
  command: ['selisih', 'seliisihtanggal', 'datediff'],
  category: 'tools',
  desc: 'Selisih dua tanggal (tahun, bulan, hari)',
  usage: '<tgl1> <tgl2>',
  run: async ({ args, prefix, reply }) => {
    const a = dates.parse(args[0])
    const b = dates.parse(args[1])
    if (!a || !b) return reply(`Format: ${prefix}selisih <tgl-bln-tahun> <tgl-bln-tahun>\nContoh: ${prefix}selisih 01-01-2020 17-08-2026`)
    const [from, to] = a.t <= b.t ? [a, b] : [b, a]
    const x = dates.ymd(from, to)
    const total = dates.days(from, to)
    await reply(
      [`📆 *SELISIH TANGGAL*`, '', `${dates.fmt(from)}  →  ${dates.fmt(to)}`, '', `▬ *${x.y} tahun ${x.m} bulan ${x.d} hari*`, `▬ Total: ${total.toLocaleString('id-ID')} hari (${(total / 7).toFixed(1)} minggu)`].join('\n')
    )
  }
}
