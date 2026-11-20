// .zakat — kalkulator zakat maal, penghasilan, dan fitrah
const { panel, rp, num, parseMoney, parseNum } = require('../../lib/uitext')

const NISAB_GRAM = 85 // nisab emas (gram)

module.exports = {
  name: 'zakat',
  command: ['zakat', 'hitungzakat'],
  category: 'tools',
  emoji: '🕌',
  desc: 'Kalkulator zakat maal, penghasilan, dan fitrah',
  usage: 'maal|penghasilan|fitrah ...',
  run: async ({ args, prefix, reply }) => {
    const sub = (args[0] || '').toLowerCase()
    const help = () =>
      reply(
        panel('KALKULATOR ZAKAT', [
          { head: '📖 *CARA PAKAI*', lines: [`${prefix}zakat maal <total harta> <harga emas/gram>`, `${prefix}zakat penghasilan <gaji per bulan> <harga emas/gram>`, `${prefix}zakat fitrah <jumlah jiwa> <harga beras/kg>`] },
          { head: '💡 *CONTOH*', lines: [`${prefix}zakat maal 250jt 1,4jt`, `${prefix}zakat penghasilan 8jt 1,4jt`, `${prefix}zakat fitrah 4 15rb`] }
        ], { tip: '💡 Harga emas & beras isi sesuai harga hari ini (cek di toko emas / pasar). Satuan: rb, jt, m.' })
      )
    if (!['maal', 'harta', 'penghasilan', 'profesi', 'fitrah'].includes(sub)) return help()

    if (sub === 'fitrah') {
      const jiwa = parseNum(args[1])
      const beras = parseMoney(args[2])
      if (!Number.isInteger(jiwa) || jiwa < 1 || jiwa > 200 || !(beras > 0)) return help()
      return reply(
        panel('ZAKAT FITRAH', [
          { head: '📝 *PERHITUNGAN*', lines: [`Jumlah jiwa : ${jiwa}`, `Per jiwa : 2,5 kg beras`, `Harga beras : ${rp(beras)} / kg`] },
          { head: '💰 *HASIL*', lines: [`Per jiwa : ${rp(2.5 * beras)}`, `*Total : ${rp(jiwa * 2.5 * beras)}*`, `Setara beras : ${num(jiwa * 2.5, 1)} kg`] }
        ], { tip: '💡 Besaran fitrah mengikuti ketetapan BAZNAS/Kemenag setempat. Dibayar sebelum salat Idulfitri.' })
      )
    }

    const amount = parseMoney(args[1])
    const gold = parseMoney(args[2])
    if (!(amount > 0) || !(gold > 0)) return help()
    const nisabYear = NISAB_GRAM * gold
    const maal = sub === 'maal' || sub === 'harta'

    if (maal) {
      const wajib = amount >= nisabYear
      return reply(
        panel('ZAKAT MAAL', [
          { head: '📝 *DATA*', lines: [`Total harta : ${rp(amount)}`, `Harga emas : ${rp(gold)} / gram`, `Nisab (${NISAB_GRAM} gram emas) : ${rp(nisabYear)}`] },
          { head: '💰 *HASIL*', lines: wajib ? [`Status : ✅ Wajib zakat`, `*Zakat 2,5% : ${rp(amount * 0.025)}*`] : [`Status : ❌ Belum mencapai nisab`, `Kurang : ${rp(nisabYear - amount)}`] }
        ], { tip: '💡 Syarat: harta dimiliki penuh & mencapai nisab selama satu tahun (haul). Konsultasi ke BAZNAS/ulama untuk kasus khusus.' })
      )
    }

    const nisabMonth = nisabYear / 12
    const wajib = amount >= nisabMonth
    await reply(
      panel('ZAKAT PENGHASILAN', [
        { head: '📝 *DATA*', lines: [`Penghasilan/bulan : ${rp(amount)}`, `Harga emas : ${rp(gold)} / gram`, `Nisab (${NISAB_GRAM} gram ÷ 12 bulan) : ${rp(nisabMonth)}/bulan`] },
        { head: '💰 *HASIL*', lines: wajib ? [`Status : ✅ Wajib zakat`, `*Zakat 2,5% : ${rp(amount * 0.025)} / bulan*`, `Per tahun : ${rp(amount * 0.025 * 12)}`] : [`Status : ❌ Belum mencapai nisab`, `Kurang : ${rp(nisabMonth - amount)} / bulan`] }
      ], { tip: '💡 Mengikuti panduan BAZNAS (nisab 85 gram emas per tahun). Boleh dibayar bulanan atau sekaligus.' })
    )
  }
}
