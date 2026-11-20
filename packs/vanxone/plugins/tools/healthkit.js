// Kalkulator kebugaran: lemak tubuh, 1RM, makro harian, detak jantung, pace lari
const kit = require('../../lib/kit')
const { panel, num } = require('../../lib/uitext')

const bad = (m) => Object.assign(new Error('arg'), { userMessage: m })
const N = (v, name, lo, hi) => { const x = Number(String(v || '').replace(',', '.')); if (!Number.isFinite(x) || x < lo || x > hi) throw bad(`${name} tidak valid (${lo}-${hi}).`); return x }

const specs = {
  bodyfat: { desc: 'Perkiraan persen lemak tubuh (metode US Navy)', usage: '<pria|wanita> <tinggi cm> <leher cm> <pinggang cm> [pinggul cm]', example: 'pria 170 38 85', args: true, run: async (c) => {
    const g = (c.args[0] || '').toLowerCase()
    if (!['pria', 'wanita'].includes(g)) throw bad('Jenis kelamin: pria atau wanita.')
    const h = N(c.args[1], 'Tinggi', 120, 230); const neck = N(c.args[2], 'Leher', 20, 70); const waist = N(c.args[3], 'Pinggang', 40, 200)
    let bf
    if (g === 'pria') { if (waist <= neck) throw bad('Pinggang harus lebih besar dari leher.'); bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(h)) - 450 } else {
      const hip = N(c.args[4], 'Pinggul', 50, 200)
      if (waist + hip <= neck) throw bad('Ukuran tidak masuk akal.')
      bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(h)) - 450
    }
    if (!Number.isFinite(bf)) throw bad('Ukuran tidak masuk akal.')
    bf = Math.max(2, bf)
    const t = g === 'pria' ? [[6, 'Esensial'], [14, 'Atletis'], [18, 'Bugar'], [25, 'Rata-rata'], [100, 'Berlebih']] : [[14, 'Esensial'], [21, 'Atletis'], [25, 'Bugar'], [32, 'Rata-rata'], [100, 'Berlebih']]
    return panel('LEMAK TUBUH', [{ head: '📏 *HASIL*', lines: [`Lemak tubuh : *${num(bf, 1)}%*`, `Kategori : ${t.find(([m]) => bf < m)[1]}`] }], { tip: 'Perkiraan kasar. Untuk akurasi gunakan DEXA/pengukuran profesional.' })
  } },
  onerm: { desc: 'Perkiraan beban maksimal 1 repetisi (1RM) + tabel persentase latihan', usage: '<beban kg> <repetisi>', example: '80 6', args: true, run: async (c) => {
    const w = N(c.args[0], 'Beban', 1, 1000); const r = Math.round(N(c.args[1], 'Repetisi', 1, 30))
    const e = r === 1 ? w : w * (1 + r / 30); const b = r === 1 ? w : (r < 37 ? (w * 36) / (37 - r) : w)
    const rm = (e + b) / 2
    return panel('ESTIMASI 1RM', [
      { head: '🏋️ *HASIL*', lines: [`Beban x repetisi : ${num(w, 1)} kg x ${r}`, `1RM (Epley) : ${num(e, 1)} kg`, `1RM (Brzycki) : ${num(b, 1)} kg`, `Rata-rata : *${num(rm, 1)} kg*`] },
      { head: '📋 *TABEL LATIHAN*', lines: [[95, '2 rep'], [90, '4 rep'], [85, '6 rep'], [80, '8 rep'], [75, '10 rep'], [70, '12 rep'], [60, '15+ rep']].map(([p, t]) => `${p}% : ${num((rm * p) / 100, 1)} kg (± ${t})`) }
    ], { tip: 'Hanya perkiraan. Gunakan spotter saat mencoba beban maksimal.' })
  } },
  makro: { desc: 'Hitung kebutuhan makro harian (protein/karbo/lemak) dari kalori & tujuan', usage: '<kalori> [diet|jaga|bulking]', example: '2200 diet', args: true, run: async (c) => {
    const k = N(c.args[0], 'Kalori', 800, 8000)
    const goal = (c.args[1] || 'jaga').toLowerCase()
    const P = { diet: [40, 35, 25], jaga: [30, 40, 30], bulking: [30, 45, 25] }[goal]
    if (!P) throw bad('Tujuan: diet, jaga, atau bulking.')
    const g = [(k * P[0]) / 100 / 4, (k * P[1]) / 100 / 4, (k * P[2]) / 100 / 9]
    return panel('MAKRO HARIAN', [
      { head: `🎯 *TARGET (${goal})*`, lines: [`Kalori : *${num(k, 0)} kkal*`, `Protein : ${num(g[0], 0)} g (${P[0]}%)`, `Karbohidrat : ${num(g[1], 0)} g (${P[1]}%)`, `Lemak : ${num(g[2], 0)} g (${P[2]}%)`] }
    ], { tip: 'Perkiraan umum, sesuaikan dengan kondisi tubuh dan anjuran ahli gizi.' })
  } },
  detak: { desc: 'Zona detak jantung latihan berdasarkan usia', usage: '<usia>', example: '25', args: true, run: async (c) => {
    const a = N(c.args[0], 'Usia', 10, 100); const mx = 220 - a
    const Z = [['Z1 Pemulihan', 50, 60], ['Z2 Pembakaran lemak', 60, 70], ['Z3 Aerobik', 70, 80], ['Z4 Ambang', 80, 90], ['Z5 Maksimal', 90, 100]]
    return panel('ZONA DETAK JANTUNG', [{ head: `❤️ *MAKS ± ${mx} bpm*`, lines: Z.map(([n, lo, hi]) => `${n} : ${Math.round((mx * lo) / 100)}-${Math.round((mx * hi) / 100)} bpm`) }], { tip: 'Rumus 220 - usia adalah perkiraan umum.' })
  } }
}

module.exports = kit.multi({ name: 'healthkit', category: 'tools', emoji: '💪', desc: 'Lemak tubuh, 1RM, makro, zona detak jantung, pace lari', specs })
