// .lotre beli [jumlah] | .lotre info — undian per grup/bot, jackpot terkumpul, ditarik setiap 24 jam
const { createStore } = require('../../lib/store')
const { getUser, save, rp, rand, duration } = require('../../lib/game')
const { userOf } = require('../../lib/utils')
const store = createStore('lotre', { pot: 0, round: 1, ends: 0, tickets: {} })
const PRICE = 5000
function draw() {
  const s = store.data
  const all = Object.entries(s.tickets).flatMap(([id, n]) => Array(n).fill(id))
  let res = null
  if (all.length) {
    const winner = all[rand(0, all.length - 1)]
    const u = getUser(winner)
    u.money += s.pot; save()
    res = { winner, pot: s.pot, round: s.round }
  }
  s.round++; s.pot = 0; s.tickets = {}; s.ends = Date.now() + 24 * 3600e3
  store.save()
  return res
}
module.exports = {
  name: 'lotre', command: ['lotre', 'lottery', 'undian'], category: 'game', emoji: '🎰', desc: 'Lotre bersama: beli tiket, 1 pemenang ambil seluruh jackpot', usage: 'beli [jumlah] | info',
  run: async ({ sock, msg, from, sender, args, prefix, reply }) => {
    const s = store.data
    if (!s.ends) { s.ends = Date.now() + 24 * 3600e3; store.save() }
    let last = null
    if (Date.now() > s.ends) last = draw()
    const me = userOf(sender)
    const sub = (args[0] || 'info').toLowerCase()
    const pre = last ? `🏁 *Ronde #${last.round} selesai!* Pemenang: @${last.winner} meraih ${rp(last.pot)}\n\n` : ''
    const mentions = last ? [`${last.winner}@s.whatsapp.net`] : []
    if (sub === 'beli' || sub === 'buy') {
      const n = Math.max(1, Math.min(100, parseInt(args[1], 10) || 1))
      const u = getUser(sender)
      if (u.money < n * PRICE) return reply(`Uangmu kurang. ${n} tiket = ${rp(n * PRICE)}.`)
      u.money -= n * PRICE; s.pot += n * PRICE; s.tickets[me] = (s.tickets[me] || 0) + n; save(); store.save()
      return sock.sendMessage(from, { text: `${pre}🎟️ Kamu membeli *${n}* tiket (${rp(n * PRICE)}).\n▬ *Tiketmu:* ${s.tickets[me]}\n▬ *Jackpot:* ${rp(s.pot)}`, mentions }, { quoted: msg })
    }
    const total = Object.values(s.tickets).reduce((a, b) => a + b, 0)
    const mine = s.tickets[me] || 0
    await sock.sendMessage(from, { text: `${pre}🎰 *LOTRE ronde #${s.round}*\n\n▬ *Jackpot:* ${rp(s.pot)}\n▬ *Tiket terjual:* ${total}\n▬ *Tiketmu:* ${mine}${total ? ` (peluang ${((mine / total) * 100).toFixed(1)}%)` : ''}\n▬ *Undian dalam:* ${duration(Math.max(0, s.ends - Date.now()))}\n▬ *Harga:* ${rp(PRICE)} / tiket\n\n💡 ${prefix}lotre beli 3`, mentions }, { quoted: msg })
  }
}
