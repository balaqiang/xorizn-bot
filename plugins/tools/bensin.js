const { rp, num } = require('../../lib/fx')
module.exports = {
  name: 'bensin', command: ['bensin', 'bbm', 'biayaperjalanan'], category: 'tools', emoji: '⛽', desc: 'Hitung biaya BBM perjalanan', usage: '<jarak km> <km per liter> <harga per liter>',
  run: async ({ args, prefix, reply }) => {
    const [d, k, p] = args.map((x) => Number(String(x).replace(',', '.').replace(/\.(?=\d{3})/g, '')))
    if (!(d > 0 && k > 0 && p > 0)) return reply(`Format: ${prefix}bensin <jarak km> <km/liter> <harga/liter>\nContoh: ${prefix}bensin 120 12 10000`)
    const l = d / k
    await reply(`⛽ *BIAYA BBM*\n\n▬ *Jarak:* ${num(d)} km\n▬ *Konsumsi:* ${num(k)} km/L\n▬ *BBM dibutuhkan:* ${num(l)} liter\n▬ *Biaya sekali jalan:* ${rp(l * p)}\n▬ *Pulang-pergi:* ${rp(l * p * 2)}\n▬ *Per km:* ${rp(p / k)}`)
  }
}
