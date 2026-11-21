const { getUser, save, rp, rand } = require('../../lib/game')
const { btn } = require('../../lib/interactive')
const { sendGame, parseBet, createSessions } = require('../../lib/richgame')

const sessions = createSessions(5 * 60 * 1000)
const key = (from, sender) => `${from}:${String(sender).split('@')[0].split(':')[0]}`
const NAMES = { 11: 'J', 12: 'Q', 13: 'K', 14: 'A' }
const name = (r) => NAMES[r] || String(r)
const MAX_WINS = 10
const EDGE = 0.95 // pengali per langkah = 0.95 / peluang

// peluang kartu berikutnya lebih tinggi / lebih rendah (13 nilai sama rata, seri = kalah)
const chance = (r, dir) => (dir === 'high' ? (14 - r) / 13 : (r - 2) / 13)

function board(s) {
  return [
    '🎴 *HI-LO*',
    `Taruhan: ${rp(s.bet)}  •  Menang beruntun: ${s.wins}`,
    '',
    `Kartu sekarang: *${name(s.card)}*`,
    `Pengali: x${s.mult.toFixed(2)}  (${rp(Math.floor(s.bet * s.mult))})`,
    '',
    'Kartu berikutnya lebih tinggi atau lebih rendah? (As = tertinggi, seri = kalah)'
  ].join('\n')
}

async function prompt(ctx, s) {
  const { prefix } = ctx
  const buttons = []
  if (s.card < 14) buttons.push(btn.reply(`⬆️ Tinggi (${Math.round(chance(s.card, 'high') * 100)}%)`, `${prefix}hilo high`))
  if (s.card > 2) buttons.push(btn.reply(`⬇️ Rendah (${Math.round(chance(s.card, 'low') * 100)}%)`, `${prefix}hilo low`))
  if (s.wins > 0) buttons.push(btn.reply('💰 Ambil', `${prefix}hilo cash`))
  await sendGame(ctx, { body: board(s), buttons })
}

async function cashOut(ctx, s) {
  const { from, sender, prefix } = ctx
  sessions.del(key(from, sender))
  const payout = Math.floor(s.bet * s.mult)
  const u = getUser(sender)
  u.money += payout
  save()
  await sendGame(ctx, {
    body: `🎴 *HI-LO*\n\n💰 Kamu mengambil ${rp(payout)} (x${s.mult.toFixed(2)}, ${s.wins} kali benar)\nUntung: +${rp(payout - s.bet)}\nMoney: ${rp(u.money)}`,
    buttons: [btn.reply(`🔁 Main lagi ${rp(s.bet)}`, `${prefix}hilo ${s.bet}`)]
  })
}

module.exports = {
  name: 'hilo',
  command: ['hilo', 'highlow'],
  category: 'game',
  desc: 'Tebak kartu berikutnya lebih tinggi/rendah, pengali naik tiap benar',
  usage: '<taruhan>',
  run: async (ctx) => {
    const { from, sender, args, prefix, reply } = ctx
    const k = key(from, sender)
    const sub = (args[0] || '').toLowerCase()
    const s = sessions.get(k)

    if (['high', 'low', 'cash'].includes(sub)) {
      if (!s) return reply(`Tidak ada permainan aktif. Mulai dengan ${prefix}hilo <taruhan>`)
      if (sub === 'cash') {
        if (s.wins < 1) return reply('Tebak benar sekali dulu sebelum mengambil hadiah.')
        return cashOut(ctx, s)
      }
      if ((sub === 'high' && s.card === 14) || (sub === 'low' && s.card === 2)) {
        return reply('Pilihan itu tidak mungkin untuk kartu ini.')
      }

      const p = chance(s.card, sub)
      const next = rand(2, 14)
      const ok = sub === 'high' ? next > s.card : next < s.card
      if (!ok) {
        sessions.del(k)
        const u = getUser(sender)
        return sendGame(ctx, {
          body: `🎴 *HI-LO*\n\nKartu: *${name(s.card)}* → *${name(next)}*\n💀 Salah! Taruhan ${rp(s.bet)} hangus.\nMoney: ${rp(u.money)}`,
          buttons: [btn.reply(`🔁 Main lagi ${rp(s.bet)}`, `${prefix}hilo ${s.bet}`)]
        })
      }

      s.mult *= EDGE / p
      s.wins++
      s.card = next
      sessions.touch(k)
      if (s.wins >= MAX_WINS) return cashOut(ctx, s)
      return prompt(ctx, s)
    }

    if (s) return prompt(ctx, s)

    const u = getUser(sender)
    const { bet, error } = parseBet(args[0], u)
    if (error) return reply(`${error}\nContoh: ${prefix}hilo 5000`)

    u.money -= bet
    save()
    const state = sessions.set(k, { bet, card: rand(3, 13), mult: 1, wins: 0 })
    await prompt(ctx, state)
  }
}
