// .tabungan — simulasi tabungan/investasi bunga majemuk (hitung hasil atau setoran yang dibutuhkan)
const { panel, rp, num, parseMoney, parseNum } = require('../../lib/uitext')

module.exports = {
  name: 'tabungan',
  command: ['tabungan', 'nabung', 'bungamajemuk', 'compound'],
  category: 'tools',
  emoji: '🐷',
  desc: 'Simulasi tabungan/investasi bunga majemuk & target nabung',
  usage: '<setoran/bln> <bunga %/thn> <tahun> [awal]  |  target <jumlah> <bunga> <tahun> [awal]',
  run: async ({ args, prefix, reply }) => {
    const help = () =>
      reply(
        panel('SIMULASI TABUNGAN', [
          { head: '📖 *HITUNG HASIL*', lines: [`${prefix}tabungan <setoran/bln> <bunga %/thn> <tahun> [modal awal]`, `Contoh: ${prefix}tabungan 500rb 6 10`, `Contoh: ${prefix}tabungan 1jt 5 15 10jt`] },
          { head: '🎯 *HITUNG TARGET*', lines: [`${prefix}tabungan target <jumlah> <bunga %/thn> <tahun> [modal awal]`, `Contoh: ${prefix}tabungan target 100jt 6 5`] }
        ], { tip: '💡 Satuan: rb/k = ribu, jt = juta, m = miliar. Bunga dihitung majemuk bulanan.' })
      )
    const target = (args[0] || '').toLowerCase() === 'target'
    const a = target ? args.slice(1) : args
    const amount = parseMoney(a[0])
    const rate = parseNum(a[1])
    const years = parseNum(a[2])
    const init = a[3] === undefined ? 0 : parseMoney(a[3])
    if (amount === null || rate === null || years === null || init === null) return help()
    if (!(amount > 0) || !(rate >= 0 && rate <= 100) || !(years >= 1 && years <= 60) || !Number.isInteger(years)) {
      return reply('Nilai tidak masuk akal. Ketentuan: jumlah > 0, bunga 0-100 %/tahun, lama 1-60 tahun (bilangan bulat).')
    }
    const n = years * 12
    const r = rate / 100 / 12
    const grow = Math.pow(1 + r, n)
    const annuity = r === 0 ? n : (grow - 1) / r // faktor nilai akhir setoran bulanan

    if (target) {
      const need = (amount - init * grow) / annuity
      if (need <= 0) return reply(`Modal awal ${rp(init)} saja sudah cukup mencapai ${rp(amount)} dalam ${years} tahun. 🎉`)
      const put = need * n
      return reply(
        panel('TARGET NABUNG', [
          { head: '🎯 *TARGET*', lines: [`Target : ${rp(amount)}`, `Jangka waktu : ${years} tahun (${n} bulan)`, `Bunga : ${num(rate)} % per tahun`, init ? `Modal awal : ${rp(init)}` : null].filter(Boolean) },
          { head: '💰 *YANG HARUS DISETOR*', lines: [`*Per bulan : ${rp(need)}*`, `Total setoran : ${rp(put + init)}`, `Bunga yang didapat : ${rp(amount - put - init)}`] }
        ], { tip: '💡 Ilustrasi, belum memperhitungkan pajak bunga, biaya, dan inflasi.' })
      )
    }

    const fv = init * grow + amount * annuity
    const deposits = init + amount * n
    await reply(
      panel('SIMULASI TABUNGAN', [
        { head: '📝 *INPUT*', lines: [`Setoran per bulan : ${rp(amount)}`, `Bunga : ${num(rate)} % per tahun`, `Jangka waktu : ${years} tahun (${n} bulan)`, init ? `Modal awal : ${rp(init)}` : null].filter(Boolean) },
        { head: '📈 *HASIL*', lines: [`Total setoran : ${rp(deposits)}`, `Bunga yang didapat : ${rp(fv - deposits)}`, `*Saldo akhir : ${rp(fv)}*`] }
      ], { tip: '💡 Ilustrasi, belum memperhitungkan pajak bunga, biaya, dan inflasi.' })
    )
  }
}
