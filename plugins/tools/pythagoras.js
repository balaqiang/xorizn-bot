const { num } = require('../../lib/fx')
module.exports = {
  name: 'pythagoras', command: ['pythagoras', 'phytagoras', 'sisimiring'], category: 'tools', emoji: '📏', desc: 'Teorema Pythagoras: isi 2 sisi, kosongkan yang dicari dengan ?', usage: '<a> <b> <c> (satu diisi ?)',
  run: async ({ args, prefix, reply }) => {
    if (args.length !== 3 || args.filter((x) => x === '?').length !== 1) return reply(`Contoh: ${prefix}pythagoras 3 4 ?  (cari sisi miring c)\nContoh: ${prefix}pythagoras 3 ? 5  (cari sisi b)`)
    const v = args.map((x) => (x === '?' ? null : Number(x.replace(',', '.'))))
    if (v.some((x) => x !== null && !(x > 0))) return reply('Sisi harus angka positif.')
    const [a, b, c] = v
    let res, w
    if (c === null) { res = Math.hypot(a, b); w = 'c (sisi miring)' } else { const o = a === null ? b : a; if (c <= o) return reply('Sisi miring harus lebih panjang dari sisi lain.'); res = Math.sqrt(c * c - o * o); w = a === null ? 'a' : 'b' }
    await reply(`📏 *PYTHAGORAS*\n\n▬ *Rumus:* a² + b² = c²\n▬ *Dicari:* ${w}\n▬ *Hasil:* ${num(res, 4)}`)
  }
}
