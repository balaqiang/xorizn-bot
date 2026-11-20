const { num } = require('../../lib/fx')
module.exports = {
  name: 'statistik', command: ['stat', 'statdata', 'rataan'], category: 'tools', emoji: '📈', desc: 'Statistik data: rata-rata, median, modus, simpangan baku, min/max', usage: '<angka angka ...>',
  run: async ({ args, text, prefix, reply }) => {
    const xs = text.split(/[\s,;]+/).map((x) => Number(x.replace(',', '.'))).filter((x) => Number.isFinite(x))
    if (xs.length < 2) return reply(`Masukkan minimal 2 angka.\nContoh: ${prefix}stat 80 75 90 85 70`)
    if (xs.length > 500) return reply('Maksimal 500 angka.')
    const s = [...xs].sort((a, b) => a - b), n = xs.length, sum = xs.reduce((a, b) => a + b, 0), mean = sum / n
    const med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2
    const cnt = new Map(); xs.forEach((x) => cnt.set(x, (cnt.get(x) || 0) + 1))
    const mx = Math.max(...cnt.values()); const modus = mx === 1 ? 'tidak ada' : [...cnt].filter(([, c]) => c === mx).map(([v]) => v).join(', ')
    const varp = xs.reduce((a, b) => a + (b - mean) ** 2, 0) / n
    const vars = n > 1 ? (varp * n) / (n - 1) : 0
    const q = (p) => { const i = (n - 1) * p, lo = Math.floor(i); return s[lo] + (s[Math.min(lo + 1, n - 1)] - s[lo]) * (i - lo) }
    await reply(['📈 *STATISTIK DATA*', '', `▬ *Jumlah data:* ${n}`, `▬ *Total:* ${num(sum)}`, `▬ *Rata-rata:* ${num(mean)}`, `▬ *Median:* ${num(med)}`, `▬ *Modus:* ${modus}`, `▬ *Min / Max:* ${num(s[0])} / ${num(s[n - 1])}`, `▬ *Rentang:* ${num(s[n - 1] - s[0])}`, `▬ *Kuartil Q1 / Q3:* ${num(q(0.25))} / ${num(q(0.75))}`, `▬ *Simpangan baku (populasi):* ${num(Math.sqrt(varp))}`, `▬ *Simpangan baku (sampel):* ${num(Math.sqrt(vars))}`, `▬ *Varians (populasi):* ${num(varp)}`].join('\n'))
  }
}
