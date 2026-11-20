const { rp, num } = require('../../lib/fx')
const { parseMoney } = require('../../lib/uitext')
module.exports = {
  name: 'bep', command: ['bep', 'titikimpas', 'breakeven'], category: 'tools', emoji: '⚖️', desc: 'Titik impas usaha: biaya tetap, harga jual/unit, biaya variabel/unit', usage: '<biaya tetap> <harga jual> <biaya variabel>',
  run: async ({ args, prefix, reply }) => {
    const [f, p, v] = args.map(parseMoney)
    if (![f, p, v].every((x) => x !== null) || p <= v) return reply(`Contoh: ${prefix}bep 5jt 25rb 15rb\n(Harga jual harus lebih besar dari biaya variabel)`)
    const q = Math.ceil(f / (p - v))
    await reply(`⚖️ *BREAK EVEN POINT*\n\n▬ *Biaya tetap:* ${rp(f)}\n▬ *Harga jual / unit:* ${rp(p)}\n▬ *Biaya variabel / unit:* ${rp(v)}\n▬ *Margin / unit:* ${rp(p - v)} (${num(((p - v) / p) * 100, 1)}%)\n\n🎯 *BEP:* ${num(q, 0)} unit\n💰 *BEP (rupiah):* ${rp(q * p)}`)
  }
}
