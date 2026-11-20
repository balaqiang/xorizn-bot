const { rp } = require('../../lib/fx')
const { parseMoney } = require('../../lib/uitext')
module.exports = {
  name: 'tip', command: ['tip', 'servis', 'pajakresto'], category: 'tools', emoji: '🧾', desc: 'Hitung tagihan + pajak + service lalu bagi per orang', usage: '<tagihan> [pajak%] [service%] [orang]',
  run: async ({ args, prefix, reply }) => {
    const b = parseMoney(args[0]); const tax = Number(args[1] ?? 10), sv = Number(args[2] ?? 5), n = Math.max(1, parseInt(args[3], 10) || 1)
    if (!b || !(tax >= 0) || !(sv >= 0)) return reply(`Format: ${prefix}tip <tagihan> [pajak%] [service%] [orang]\nContoh: ${prefix}tip 250rb 10 5 4`)
    const t = b * (tax / 100), s = b * (sv / 100), tot = b + t + s
    await reply(`🧾 *TAGIHAN RESTO*\n\n▬ *Subtotal:* ${rp(b)}\n▬ *Pajak ${tax}%:* ${rp(t)}\n▬ *Service ${sv}%:* ${rp(s)}\n▬ *Total:* ${rp(tot)}\n▬ *Dibagi ${n} orang:* ${rp(Math.ceil(tot / n))} / orang`)
  }
}
