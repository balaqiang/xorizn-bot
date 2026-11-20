// Kalkulator ketenagakerjaan & emas: THR, lembur, karat emas
const { panel, rp, num, parseMoney, parseNum } = require('../../lib/uitext')

// hitung kelipatan upah sejam. tiers = [[jam di tingkat ini, pengali], ...] (tingkat terakhir tanpa batas)
function overtime(hours, tiers) {
  let left = hours
  let mult = 0
  const detail = []
  tiers.forEach(([cap, m], i) => {
    const h = i === tiers.length - 1 ? left : Math.min(left, cap)
    if (h > 0) {
      mult += h * m
      detail.push({ h, m })
      left -= h
    }
  })
  return { mult, detail }
}

const MODES = {
  kerja: ['hari kerja biasa', [[1, 1.5], [Infinity, 2]]],
  libur6: ['hari libur (6 hari kerja/minggu)', [[7, 2], [1, 3], [Infinity, 4]]],
  libur5: ['hari libur (5 hari kerja/minggu)', [[8, 2], [1, 3], [Infinity, 4]]]
}

module.exports = {
  name: 'kerja',
  command: ['thr', 'lembur', 'karat'],
  category: 'tools',
  emoji: '👷',
  desc: 'Kalkulator THR, upah lembur, dan kadar emas (karat)',
  usage: 'thr <gaji> <masa kerja bln> | lembur <gaji> <jam> [libur6|libur5] | karat <K> [gram]',
  run: async ({ command, args, prefix, reply }) => {
    const bad = (ex) => reply(`Format salah.\nContoh: ${prefix}${command} ${ex}`)

    if (command === 'thr') {
      const gaji = parseMoney(args[0])
      const m = String(args[1] || '').toLowerCase().match(/^(\d+(?:[.,]\d+)?)(th|tahun|bln|bulan)?$/)
      if (!(gaji > 0) || !m) return bad('5jt 8   (gaji+tunjangan tetap, masa kerja dalam bulan; "2th" = 2 tahun)')
      const bulan = parseNum(m[1]) * (/^t/.test(m[2] || '') ? 12 : 1)
      if (bulan < 1) return reply('THR diberikan untuk pekerja dengan masa kerja minimal 1 bulan terus-menerus.')
      const thr = bulan >= 12 ? gaji : (bulan / 12) * gaji
      return reply(panel('HITUNG THR', [
        { head: '📝 *DATA*', lines: [`Upah per bulan : ${rp(gaji)}`, `Masa kerja : ${num(bulan, 1)} bulan`] },
        { head: '🎁 *HASIL*', lines: [bulan >= 12 ? 'Rumus : masa kerja ≥ 12 bulan → 1 bulan upah' : `Rumus : masa kerja ÷ 12 × 1 bulan upah (${num(bulan, 1)}/12)`, `*THR : ${rp(thr)}*`] }
      ], { tip: '💡 Upah = gaji pokok + tunjangan tetap. Acuan: aturan THR keagamaan pekerja (PP 36/2021). Cek kebijakan perusahaanmu.' }))
    }

    if (command === 'lembur') {
      const gaji = parseMoney(args[0])
      const jam = parseNum(args[1])
      const mode = (args[2] || 'kerja').toLowerCase()
      if (!(gaji > 0) || jam === null || !(jam > 0 && jam <= 24) || !MODES[mode]) return bad('8650000 3   (gaji sebulan, jam lembur; tambah libur6 / libur5 untuk hari libur)')
      const sejam = gaji / 173
      const { mult, detail } = overtime(jam, MODES[mode][1])
      return reply(panel('UPAH LEMBUR', [
        { head: '📝 *DATA*', lines: [`Upah sebulan : ${rp(gaji)}`, `Upah sejam (1/173) : ${rp(sejam)}`, `Lembur : ${num(jam, 2)} jam pada ${MODES[mode][0]}`] },
        { head: '⏱️ *PERINCIAN*', lines: detail.map((d) => `${num(d.h, 2)} jam × ${num(d.m, 1)} = ${num(d.h * d.m, 2)} jam upah`) },
        { head: '💰 *HASIL*', lines: [`Total pengali : ${num(mult, 2)} × upah sejam`, `*Upah lembur : ${rp(mult * sejam)}*`] }
      ], { tip: '💡 Rumus umum Kepmenakertrans 102/2004 (upah sejam = 1/173 upah sebulan). Perjanjian kerja bisa berbeda.' }))
    }

    // karat
    const k = parseNum(args[0])
    const gram = args[1] === undefined ? null : parseNum(args[1])
    if (k === null || k <= 0 || k > 24 || (args[1] !== undefined && !(gram > 0))) return bad('18   atau   22 10   (karat, [berat gram])')
    const pure = k / 24
    const lines = [`${num(k, 1)} karat = *${num(pure * 100, 2)}%* emas murni`, `Kadar campuran lain : ${num((1 - pure) * 100, 2)}%`]
    if (gram) lines.push(`${num(gram, 2)} gram emas ${num(k, 1)}K mengandung *${num(gram * pure, 3)} gram* emas murni (24K)`)
    return reply(panel('KADAR EMAS', [
      { head: '🪙 *HASIL*', lines },
      { head: '📋 *KARAT UMUM*', lines: [24, 22, 18, 14, 10, 9].map((x) => `${x}K = ${num((x / 24) * 100, 1)}%`), plain: false }
    ], { tip: '💡 Di pasaran, emas 24K biasa disebut 99,9% (bukan tepat 100%).' }))
  }
}
module.exports.overtime = overtime
