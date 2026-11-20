// .ipk — hitung IP semester & IPK kumulatif
const { panel, num, parseNum } = require('../../lib/uitext')

// Skala 4.0 yang umum dipakai kampus di Indonesia
const POINT = { A: 4, 'A-': 3.7, 'B+': 3.3, B: 3, 'B-': 2.7, 'C+': 2.3, C: 2, 'C-': 1.7, D: 1, E: 0 }

function parse(args) {
  const items = []
  let prev = null
  for (let i = 0; i < args.length; i++) {
    const t = String(args[i])
    let m = t.match(/^(?:lama|ipk)[=:]([\d.,]+)[/:](\d+(?:[.,]\d+)?)$/i)
    if (m) {
      prev = { ipk: parseNum(m[1]), sks: parseNum(m[2]) }
      continue
    }
    // "A3", "B+:4", "A-x3"
    m = t.match(/^([a-e])([+-])?[:=*x/]?(\d+(?:[.,]\d+)?)$/i)
    if (m) {
      const g = (m[1] + (m[2] || '')).toUpperCase()
      if (!(g in POINT)) return { error: `Nilai "${g}" tidak dikenal` }
      items.push({ g, sks: parseNum(m[3]) })
      continue
    }
    // "A" lalu "3" sebagai dua argumen terpisah
    m = t.match(/^([a-e])([+-])?$/i)
    if (m && args[i + 1] && /^\d+([.,]\d+)?$/.test(args[i + 1])) {
      const g = (m[1] + (m[2] || '')).toUpperCase()
      if (!(g in POINT)) return { error: `Nilai "${g}" tidak dikenal` }
      items.push({ g, sks: parseNum(args[++i]) })
      continue
    }
    return { error: `Tidak mengerti "${t}"` }
  }
  return { items, prev }
}

module.exports = {
  name: 'ipk',
  command: ['ipk', 'hitungipk', 'ipsemester'],
  category: 'tools',
  emoji: '🎓',
  desc: 'Hitung IP semester & IPK dari nilai huruf dan SKS',
  usage: '<nilai><sks> ... [lama=<ipk>/<sks>]',
  run: async ({ args, prefix, reply }) => {
    const help = () =>
      reply(
        panel(
          'HITUNG IPK',
          [
            { head: '📖 *CARA PAKAI*', lines: [`${prefix}ipk A3 B+3 A-2 C4`, `${prefix}ipk A 3 B 3 C 2  (boleh dipisah spasi)`, `${prefix}ipk A3 B3 lama=3.5/40  (IPK kumulatif)`], },
            { head: '📊 *SKALA NILAI*', lines: ['A=4 • A-=3,7 • B+=3,3 • B=3 • B-=2,7', 'C+=2,3 • C=2 • C-=1,7 • D=1 • E=0'] }
          ],
          { tip: '💡 Skala tiap kampus bisa berbeda. Ini skala 4.0 yang paling umum.' }
        )
      )
    if (!args.length) return help()
    const { items, prev, error } = parse(args)
    if (error) return reply(`${error}.\nContoh: ${prefix}ipk A3 B+3 C2`)
    if (!items.length || items.length > 30) return help()
    if (items.some((x) => !(x.sks > 0 && x.sks <= 24))) return reply('SKS tiap mata kuliah harus antara 1 sampai 24.')
    if (prev && !(prev.ipk >= 0 && prev.ipk <= 4 && prev.sks > 0)) return reply('Format IPK lama salah. Contoh: lama=3.5/40 (IPK 3,5 dari 40 SKS).')

    const sks = items.reduce((a, x) => a + x.sks, 0)
    const mutu = items.reduce((a, x) => a + POINT[x.g] * x.sks, 0)
    const ip = mutu / sks
    const sections = [
      { head: '📚 *MATA KULIAH*', lines: items.map((x, i) => `${i + 1}. Nilai ${x.g} (${num(POINT[x.g], 1)}) × ${num(x.sks, 1)} SKS = ${num(POINT[x.g] * x.sks, 1)}`) },
      { head: '🎯 *HASIL SEMESTER*', lines: [`Total SKS : ${num(sks, 1)}`, `Total mutu : ${num(mutu, 2)}`, `*IP Semester : ${num(ip, 2)}*`] }
    ]
    if (prev) {
      const tot = prev.sks + sks
      const cum = (prev.ipk * prev.sks + mutu) / tot
      sections.push({ head: '🏆 *IPK KUMULATIF*', lines: [`IPK lama : ${num(prev.ipk, 2)} (${num(prev.sks, 1)} SKS)`, `Total SKS : ${num(tot, 1)}`, `*IPK sekarang : ${num(cum, 2)}*`] })
    }
    await reply(panel('HASIL IPK', sections, { tip: '💡 Hasil dibulatkan 2 desimal. Cek kebijakan pembulatan kampusmu.' }))
  }
}
