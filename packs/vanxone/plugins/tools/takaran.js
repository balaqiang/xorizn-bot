const V = { tsp: 4.92892, sdt: 5, tbsp: 14.7868, sdm: 15, cup: 240, gelas: 200, ml: 1, l: 1000, liter: 1000, floz: 29.5735 }
const W = { g: 1, gr: 1, kg: 1000, oz: 28.3495, lb: 453.592, ons: 100 }
module.exports = {
  name: 'takaran', command: ['takaran', 'resepkonversi', 'dapur'], category: 'tools', emoji: '🍳', desc: 'Konversi takaran dapur (sdt, sdm, cup, gelas, ml, gram, oz, lb)', usage: '<angka> <satuan> ke <satuan>',
  run: async ({ args, prefix, reply }) => {
    const n = Number(String(args[0] || '').replace(',', '.')); const from = (args[1] || '').toLowerCase(); const to = (args[args.length - 1] || '').toLowerCase()
    const tbl = V[from] && V[to] ? V : W[from] && W[to] ? W : null
    if (!(n >= 0) || !tbl || args.length < 3) return reply(`Volume: ${Object.keys(V).join(', ')}\nBerat: ${Object.keys(W).join(', ')}\nContoh: ${prefix}takaran 2 cup ke ml\nContoh: ${prefix}takaran 500 g ke oz`)
    const v = (n * tbl[from]) / tbl[to]
    await reply(`🍳 *TAKARAN*\n\n${n} ${from} = *${v.toLocaleString('id-ID', { maximumFractionDigits: 3 })} ${to}*\n_Nilai pendekatan standar; cup = 240 ml, gelas = 200 ml._`)
  }
}
