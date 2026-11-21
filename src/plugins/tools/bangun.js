const { num } = require('../../lib/fx')
const S = {
  persegi: ['sisi', (s) => ({ Luas: s ** 2, Keliling: 4 * s })],
  persegipanjang: ['panjang lebar', (p, l) => ({ Luas: p * l, Keliling: 2 * (p + l) })],
  segitiga: ['alas tinggi', (a, t) => ({ Luas: (a * t) / 2 })],
  lingkaran: ['jari-jari', (r) => ({ Luas: Math.PI * r ** 2, Keliling: 2 * Math.PI * r })],
  trapesium: ['sisi-sejajar-1 sisi-sejajar-2 tinggi', (a, b, t) => ({ Luas: ((a + b) * t) / 2 })],
  kubus: ['sisi', (s) => ({ Volume: s ** 3, 'Luas permukaan': 6 * s ** 2 })],
  balok: ['panjang lebar tinggi', (p, l, t) => ({ Volume: p * l * t, 'Luas permukaan': 2 * (p * l + p * t + l * t) })],
  tabung: ['jari-jari tinggi', (r, t) => ({ Volume: Math.PI * r ** 2 * t, 'Luas permukaan': 2 * Math.PI * r * (r + t) })],
  kerucut: ['jari-jari tinggi', (r, t) => { const s = Math.hypot(r, t); return { Volume: (Math.PI * r ** 2 * t) / 3, 'Luas permukaan': Math.PI * r * (r + s) } }],
  bola: ['jari-jari', (r) => ({ Volume: (4 / 3) * Math.PI * r ** 3, 'Luas permukaan': 4 * Math.PI * r ** 2 })]
}
module.exports = {
  name: 'bangun', command: ['bangun', 'bangunruang', 'luasvolume'], category: 'tools', emoji: '📐', desc: 'Luas, keliling & volume bangun datar/ruang', usage: '<bangun> <ukuran...>',
  run: async ({ args, prefix, reply }) => {
    const k = (args[0] || '').toLowerCase(); const s = S[k]
    if (!s) return reply(`📐 *BANGUN*\n${Object.entries(S).map(([n, [a]]) => `➥ ${prefix}bangun ${n} <${a}>`).join('\n')}`)
    const xs = args.slice(1).map((x) => Number(String(x).replace(',', '.')))
    if (xs.length < s[1].length || xs.some((x) => !(x > 0))) return reply(`Format: ${prefix}bangun ${k} <${s[0]}>\nContoh: ${prefix}bangun ${k} ${s[0].split(' ').map(() => 7).join(' ')}`)
    const r = s[1](...xs)
    await reply(`📐 *${k.toUpperCase()}*\n\n${Object.entries(r).map(([a, v]) => `▬ *${a}:* ${num(v, 3)}`).join('\n')}`)
  }
}
