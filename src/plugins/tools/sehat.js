// Kalkulator kesehatan umum: kebutuhan air, berat ideal, zona detak jantung (bukan pengganti saran dokter)
const { panel, num, parseNum } = require('../../lib/uitext')
const n1 = (v) => Number(v).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

module.exports = {
  name: 'sehat',
  command: ['airminum', 'beratideal', 'zonajantung'],
  category: 'tools',
  emoji: '💧',
  desc: 'Kebutuhan air minum, berat badan ideal, zona detak jantung',
  usage: '<angka...>',
  run: async ({ command, args, prefix, reply }) => {
    const bad = (ex) => reply(`Format salah.\nContoh: ${prefix}${command} ${ex}`)
    const note = '💡 Perkiraan umum, bukan pengganti saran dokter/ahli gizi.'

    if (command === 'airminum') {
      const kg = parseNum(args[0])
      if (kg === null || kg < 10 || kg > 300) return bad('60   (berat badan kg; tambah "aktif" kalau banyak olahraga)')
      const aktif = args.slice(1).some((x) => /^(aktif|olahraga)$/i.test(x))
      const lo = kg * 30 + (aktif ? 500 : 0)
      const hi = kg * 35 + (aktif ? 500 : 0)
      return reply(panel('KEBUTUHAN AIR MINUM', [{ head: '💧 *HASIL*', lines: [`Berat badan : ${num(kg, 1)} kg${aktif ? ' (aktif/olahraga +500 ml)' : ''}`, `Kebutuhan per hari : *${num(lo, 0)} – ${num(hi, 0)} ml*`, `Setara : ${num(lo / 1000, 1)} – ${num(hi / 1000, 1)} liter`, `Atau ±${Math.round(lo / 250)} – ${Math.round(hi / 250)} gelas (250 ml)`] }], { tip: `${note} Dasar hitung: 30–35 ml per kg berat badan.` }))
    }

    if (command === 'beratideal') {
      const cm = parseNum(args[0])
      const g = (args[1] || '').toLowerCase()
      if (cm === null || cm < 100 || cm > 230 || !['pria', 'cowok', 'laki', 'wanita', 'cewek', 'perempuan'].includes(g)) return bad('170 pria   (tinggi cm, pria/wanita)')
      const pria = ['pria', 'cowok', 'laki'].includes(g)
      const broca = (cm - 100) * (pria ? 0.9 : 0.85)
      const m2 = (cm / 100) ** 2
      return reply(panel('BERAT BADAN IDEAL', [{ head: '⚖️ *HASIL*', lines: [`Tinggi : ${num(cm, 0)} cm (${pria ? 'pria' : 'wanita'})`, `Rumus Broca : *${n1(broca)} kg*`, `Rentang IMT normal Asia-Pasifik (18,5–22,9) : *${n1(18.5 * m2)} – ${n1(22.9 * m2)} kg*`, `Rentang IMT normal WHO (18,5–24,9) : ${n1(18.5 * m2)} – ${n1(24.9 * m2)} kg`] }], { tip: note }))
    }

    // zonajantung
    const age = parseNum(args[0])
    if (age === null || !Number.isInteger(age) || age < 5 || age > 100) return bad('30   (umur dalam tahun)')
    const max = 220 - age
    const tanaka = Math.round(208 - 0.7 * age)
    const z = (a, b) => `${Math.round(max * a)} – ${Math.round(max * b)} bpm`
    return reply(panel('ZONA DETAK JANTUNG', [
      { head: '❤️ *DETAK MAKSIMAL*', lines: [`Rumus 220 − umur : *${max} bpm*`, `Rumus Tanaka : ${tanaka} bpm`] },
      { head: '🏃 *ZONA LATIHAN*', lines: [`Zona 1 pemanasan (50–60%) : ${z(0.5, 0.6)}`, `Zona 2 pembakaran lemak (60–70%) : ${z(0.6, 0.7)}`, `Zona 3 aerobik (70–80%) : ${z(0.7, 0.8)}`, `Zona 4 anaerobik (80–90%) : ${z(0.8, 0.9)}`, `Zona 5 maksimal (90–100%) : ${z(0.9, 1)}`] }
    ], { tip: note }))
  }
}
