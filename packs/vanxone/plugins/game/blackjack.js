const { getUser, save, rp } = require('../../lib/game')
const { btn } = require('../../lib/interactive')
const { sendGame, parseBet, createSessions } = require('../../lib/richgame')
const bj = require('../../lib/blackjack')

const sessions = createSessions(5 * 60 * 1000)
const key = (from, sender) => `${from}:${String(sender).split('@')[0].split(':')[0]}`

const LABEL = {
  blackjack: '🃏 BLACKJACK! Bayaran 3:2',
  win: '🎉 Kamu menang!',
  push: '🤝 Seri, taruhan dikembalikan.',
  lose: '💀 Bandar menang.',
  bust: '💥 Bust! Total lebih dari 21.'
}

function board(s, reveal) {
  const dealerLine = reveal
    ? `Bandar : ${bj.show(s.dealer)}  (${bj.handValue(s.dealer)})`
    : `Bandar : ${bj.show([s.dealer[0]])} 🂠`
  return [
    '🃏 *BLACKJACK*',
    `Taruhan: ${rp(s.bet)}`,
    '',
    dealerLine,
    `Kamu   : ${bj.show(s.player)}  (${bj.handValue(s.player)})`
  ].join('\n')
}

async function finish(ctx, s, forced) {
  const { from, sender, prefix } = ctx
  if (!forced && bj.handValue(s.player) <= 21) bj.dealerPlay(s.deck, s.dealer)
  const { outcome, payout } = bj.settle(s.player, s.dealer, s.bet)
  sessions.del(key(from, sender))

  const u = getUser(sender)
  u.money += payout
  save()
  const net = payout - s.bet
  const delta = net > 0 ? `+${rp(net)}` : net < 0 ? `-${rp(-net)}` : 'impas'

  await sendGame(ctx, {
    body: `${board(s, true)}\n\n${LABEL[outcome]}\nHasil: ${delta}\nMoney: ${rp(u.money)}`,
    buttons: [btn.reply(`🔁 Main lagi ${rp(s.initialBet)}`, `${prefix}bj ${s.initialBet}`)]
  })
}

async function prompt(ctx, s) {
  const { prefix, sender } = ctx
  const u = getUser(sender)
  const buttons = [btn.reply('🃏 Hit', `${prefix}bj hit`), btn.reply('✋ Stand', `${prefix}bj stand`)]
  if (s.player.length === 2 && !s.doubled && u.money >= s.bet) buttons.push(btn.reply('⏫ Double', `${prefix}bj double`))
  await sendGame(ctx, { body: board(s, false), buttons })
}

module.exports = {
  name: 'blackjack',
  command: ['blackjack', 'bj'],
  category: 'game',
  desc: 'Blackjack lawan bandar (Hit / Stand / Double)',
  usage: '<taruhan>',
  run: async (ctx) => {
    const { from, sender, args, prefix, reply } = ctx
    const k = key(from, sender)
    const sub = (args[0] || '').toLowerCase()
    const s = sessions.get(k)

    if (['hit', 'stand', 'double'].includes(sub)) {
      if (!s) return reply(`Tidak ada permainan aktif. Mulai dengan ${prefix}bj <taruhan>`)
      const u = getUser(sender)

      if (sub === 'hit') {
        s.player.push(s.deck.pop())
        const total = bj.handValue(s.player)
        if (total > 21 || total === 21) return finish(ctx, s)
        sessions.touch(k)
        return prompt(ctx, s)
      }
      if (sub === 'stand') return finish(ctx, s)

      // double: hanya di dua kartu pertama
      if (s.player.length !== 2 || s.doubled) return reply('Double hanya bisa di kartu pertama.')
      if (u.money < s.bet) return reply(`Money tidak cukup untuk double. Money: ${rp(u.money)}`)
      u.money -= s.bet
      s.bet *= 2
      s.doubled = true
      s.player.push(s.deck.pop())
      save()
      return finish(ctx, s)
    }

    if (s) return prompt(ctx, s)

    const u = getUser(sender)
    const { bet, error } = parseBet(args[0], u)
    if (error) return reply(`${error}\nContoh: ${prefix}bj 5000`)

    u.money -= bet
    save()
    const deck = bj.newDeck()
    const state = sessions.set(k, {
      deck,
      player: [deck.pop(), deck.pop()],
      dealer: [deck.pop(), deck.pop()],
      bet,
      initialBet: bet,
      doubled: false
    })

    // Blackjack alami: langsung selesai
    if (bj.isNatural(state.player) || bj.isNatural(state.dealer)) return finish(ctx, state, true)
    await prompt(ctx, state)
  }
}
