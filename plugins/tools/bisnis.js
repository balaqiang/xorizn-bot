// Kalkulator bisnis: margin, harga jual, inflasi, ROI
const { panel, rp, num, parseMoney, parseNum } = require('../../lib/uitext')

module.exports = {
  name: 'bisnis',
  command: ['margin', 'hargajual', 'inflasi', 'roi'],
  category: 'tools',
  emoji: '💼',
  desc: 'Kalkulator bisnis: margin & markup, harga jual, inflasi, ROI',
  usage: '<angka...>',
  run: async ({ command, args, prefix, reply }) => {
    const bad = (ex) => reply(`Format salah.\nContoh: ${prefix}${command} ${ex}\nSatuan: rb/k = ribu, jt = juta, m = miliar.`)

    if (command === 'margin') {
      const modal = parseMoney(args[0])
      const jual = parseMoney(args[1])
      if (!(modal > 0) || !(jual > 0)) return bad('80rb 100rb   (modal, harga jual)')
      const laba = jual - modal
      return reply(panel('MARGIN & MARKUP', [
        { head: '📝 *DATA*', lines: [`Modal (HPP) : ${rp(modal)}`, `Harga jual : ${rp(jual)}`] },
        { head: '📈 *HASIL*', lines: [`${laba >= 0 ? 'Laba' : 'Rugi'} per unit : *${rp(Math.abs(laba))}*`, `Margin (laba ÷ harga jual) : *${num((laba / jual) * 100)}%*`, `Markup (laba ÷ modal) : *${num((laba / modal) * 100)}%*`] }
      ], { tip: '💡 Margin dihitung dari harga jual, markup dari modal.' }))
    }

    if (command === 'hargajual') {
      const modal = parseMoney(args[0])
      const p = parseNum(args[1])
      if (!(modal > 0) || p === null || p <= 0 || p >= 1000) return bad('100rb 30   (modal, target laba %)')
      const byMarkup = modal * (1 + p / 100)
      const byMargin = p < 100 ? modal / (1 - p / 100) : null
      return reply(panel('HARGA JUAL', [
        { head: '📝 *DATA*', lines: [`Modal : ${rp(modal)}`, `Target laba : ${num(p)}%`] },
        { head: '💰 *HARGA JUAL*', lines: [`Dengan markup ${num(p)}% (dari modal) : *${rp(byMarkup)}*`, byMargin && `Dengan margin ${num(p)}% (dari harga jual) : *${rp(byMargin)}*`].filter(Boolean) }
      ], { tip: '💡 Pilih salah satu cara menghitung laba, jangan dicampur.' }))
    }

    if (command === 'inflasi') {
      const harga = parseMoney(args[0])
      const r = parseNum(args[1])
      const y = parseNum(args[2])
      if (!(harga > 0) || r === null || r < -50 || r > 100 || !Number.isInteger(y) || y < 1 || y > 100) return bad('100jt 5 10   (harga sekarang, inflasi %/tahun, tahun)')
      const f = harga * (1 + r / 100) ** y
      return reply(panel('PROYEKSI INFLASI', [
        { head: '📝 *DATA*', lines: [`Harga sekarang : ${rp(harga)}`, `Inflasi : ${num(r)}% per tahun`, `Jangka waktu : ${y} tahun`] },
        { head: '📈 *HASIL*', lines: [`Harga di masa depan : *${rp(f)}*`, `Naik : ${rp(f - harga)} (${num((f / harga - 1) * 100)}%)`, `Daya beli ${rp(harga)} nanti setara : ${rp(harga / (1 + r / 100) ** y)} hari ini`] }
      ], { tip: '💡 Perkiraan sederhana dengan inflasi tetap tiap tahun.' }))
    }

    // roi
    const modal = parseMoney(args[0])
    const akhir = parseMoney(args[1])
    const th = args[2] === undefined ? null : parseNum(args[2])
    if (!(modal > 0) || akhir === null || (args[2] !== undefined && !(th > 0 && th <= 100))) return bad('10jt 15jt 2   (modal, nilai akhir, [lama tahun])')
    const gain = akhir - modal
    const lines = [`Modal : ${rp(modal)}`, `Nilai akhir : ${rp(akhir)}`, `${gain >= 0 ? 'Untung' : 'Rugi'} : ${rp(Math.abs(gain))}`, `*ROI : ${gain >= 0 ? '+' : ''}${num((gain / modal) * 100)}%*`]
    if (th && akhir > 0) lines.push(`Per tahun (CAGR) : *${num(((akhir / modal) ** (1 / th) - 1) * 100)}%* selama ${num(th)} tahun`)
    return reply(panel('ROI INVESTASI', [{ head: '📊 *HASIL*', lines }], { tip: '💡 ROI = (nilai akhir − modal) ÷ modal. CAGR = rata-rata pertumbuhan per tahun.' }))
  }
}
