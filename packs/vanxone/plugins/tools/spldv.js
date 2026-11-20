const { num } = require('../../lib/fx')
module.exports = {
  name: 'spldv', command: ['spldv', 'persamaanlinear', 'sistempersamaan'], category: 'tools', emoji: '🧮', desc: 'Selesaikan sistem 2 persamaan 2 variabel: a1 b1 c1 a2 b2 c2', usage: '<a1> <b1> <c1> <a2> <b2> <c2>',
  run: async ({ args, prefix, reply }) => {
    const v = args.map((x) => Number(String(x).replace(',', '.')))
    if (v.length !== 6 || v.some((x) => !Number.isFinite(x))) return reply(`Bentuk: a1·x + b1·y = c1 dan a2·x + b2·y = c2\nContoh: ${prefix}spldv 2 1 7 1 -1 2  (2x+y=7, x-y=2)`)
    const [a1, b1, c1, a2, b2, c2] = v
    const D = a1 * b2 - a2 * b1
    if (Math.abs(D) < 1e-12) return reply('⚠️ Sistem tidak punya solusi tunggal (sejajar atau berimpit).')
    const x = (c1 * b2 - c2 * b1) / D, y = (a1 * c2 - a2 * c1) / D
    await reply(`🧮 *SPLDV*\n\n▬ *Persamaan 1:* ${a1}x + ${b1}y = ${c1}\n▬ *Persamaan 2:* ${a2}x + ${b2}y = ${c2}\n▬ *Determinan:* ${num(D, 4)}\n\n🎯 *x =* ${num(x, 4)}\n🎯 *y =* ${num(y, 4)}`)
  }
}
