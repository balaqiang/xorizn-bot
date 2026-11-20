// .berburu / .tambang / .tani — aktivitas cooldown yang memberi uang + item
const { getUser, save, rp, rand, pick, cooldown, duration } = require('../../lib/game')
const ACT = {
  berburu: { ic: '🏹', cd: 30 * 60e3, title: 'BERBURU', loot: [['🐗 Babi hutan', 9000, 22000], ['🦌 Rusa', 14000, 30000], ['🐇 Kelinci', 4000, 9000], ['🦆 Bebek liar', 5000, 11000], ['🐻 Beruang', 30000, 60000]], fail: ['Buruanmu kabur 😢', 'Kamu tersesat di hutan 🌲'] },
  tambang: { ic: '⛏️', cd: 40 * 60e3, title: 'MENAMBANG', loot: [['🪨 Batu bara', 6000, 14000], ['🥈 Perak', 15000, 30000], ['🥇 Emas', 25000, 55000], ['💎 Berlian', 50000, 110000], ['⚙️ Besi', 7000, 16000]], fail: ['Terowongan runtuh! 😱', 'Kapakmu patah ⛓️'] },
  tani: { ic: '🌾', cd: 20 * 60e3, title: 'BERTANI', loot: [['🌽 Jagung', 3000, 8000], ['🍅 Tomat', 3500, 9000], ['🥕 Wortel', 3000, 7500], ['🍉 Semangka', 6000, 14000], ['🌶️ Cabai', 8000, 20000]], fail: ['Panen gagal karena hama 🐛', 'Hujan deras merusak ladang 🌧️'] }
}
module.exports = {
  name: 'berburu', command: Object.keys(ACT), category: 'game', emoji: '🏹', desc: 'Berburu, menambang, bertani: dapat uang & item (cooldown)', usage: '',
  run: async ({ sender, command, reply }) => {
    const a = ACT[command]; if (!a) return
    const u = getUser(sender)
    const key = `last_${command}`
    const left = cooldown(u, key, a.cd)
    if (left) return reply(`${a.ic} Kamu masih lelah. Coba lagi dalam *${duration(left)}*.`)
    u[key] = Date.now()
    if (Math.random() < 0.15) { u.exp += 50; save(); return reply(`${a.ic} *${a.title}*\n\n💔 ${pick(a.fail)}\n_Tidak ada hasil kali ini._`) }
    const [name, lo, hi] = pick(a.loot)
    const qty = rand(1, 3)
    const gain = rand(lo, hi) * qty
    u.money += gain; u.exp += 400; save()
    await reply(`${a.ic} *${a.title}*\n\n▬ *Dapat:* ${name} ×${qty}\n▬ *Dijual:* +${rp(gain)}\n▬ *EXP:* +400\n▬ *Saldo:* ${rp(u.money)}`)
  }
}
