const { getUser, save, rp, rand } = require('../../lib/game')
const { btn } = require('../../lib/interactive')
const { sendGame, parseBet } = require('../../lib/richgame')

const RED = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36])
const colorOf = (n) => (n === 0 ? 'hijau' : RED.has(n) ? 'merah' : 'hitam')
const ICON = { merah: '🔴', hitam: '⚫', hijau: '🟢' }

module.exports = {
  name: 'roulette',
  command: ['roulette', 'rolet', 'roda'],
  category: 'game',
  desc: 'Roulette: tebak warna (x2, hijau x14) atau angka 0-36 (x36)',
  usage: '<merah|hitam|hijau|angka> <taruhan>',
  run: async (ctx) => {
    const { sender, args, prefix, reply } = ctx
    const first = (args[0] || '').toLowerCase()
    const isColor = ['merah', 'hitam', 'hijau'].includes(first)
    const isNum = /^\d{1,2}$/.test(first) && Number(first) <= 36
    const rawBet = isColor || isNum ? args[1] : args[0]

    const u = getUser(sender)
    const { bet, error } = parseBet(rawBet, u)
    if (error) return reply(`${error}\nContoh: ${prefix}roulette merah 5000  atau  ${prefix}roulette 17 1000`)

    if (!isColor && !isNum) {
      return sendGame(ctx, {
        body: `🎡 *ROULETTE*\n\nTaruhan: ${rp(bet)}\n🔴 Merah / ⚫ Hitam = x2\n🟢 Hijau (0) = x14\nAngka 0-36: ketik ${prefix}roulette <angka> ${bet} (x36)`,
        buttons: [btn.reply('🔴 Merah', `${prefix}roulette merah ${bet}`), btn.reply('⚫ Hitam', `${prefix}roulette hitam ${bet}`), btn.reply('🟢 Hijau', `${prefix}roulette hijau ${bet}`)]
      })
    }

    const n = rand(0, 36)
    const color = colorOf(n)
    let mult = 0
    if (isNum && Number(first) === n) mult = 36
    else if (isColor && first === color) mult = color === 'hijau' ? 14 : 2
    const change = mult ? bet * (mult - 1) : -bet
    u.money += change
    save()

    await sendGame(ctx, {
      body: [
        '🎡 *ROULETTE*',
        '',
        `Bola jatuh di: ${ICON[color]} *${n}* (${color})`,
        `Tebakanmu: ${isNum ? first : `${ICON[first]} ${first}`}`,
        '',
        mult ? `🎉 Menang x${mult}! +${rp(change)}` : `💀 Kalah. -${rp(bet)}`,
        `Money: ${rp(u.money)}`
      ].join('\n'),
      buttons: [
        btn.reply(`🔁 Lagi ${rp(bet)}`, `${prefix}roulette ${bet}`),
        btn.reply('🔴 Merah', `${prefix}roulette merah ${bet}`),
        btn.reply('⚫ Hitam', `${prefix}roulette hitam ${bet}`)
      ]
    })
  }
}
