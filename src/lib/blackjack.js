// Logika blackjack murni (tanpa WhatsApp) supaya mudah diuji
const SUITS = ['♠️', '♥️', '♦️', '♣️']
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

function newDeck(random = Math.random) {
  const deck = []
  for (let d = 0; d < 4; d++) for (const s of SUITS) for (const r of RANKS) deck.push({ r, s })
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

// Nilai tangan: As dihitung 11 selama tidak bust, selebihnya 1
function handValue(cards) {
  let total = 0
  let aces = 0
  for (const c of cards) {
    if (c.r === 'A') {
      aces++
      total += 11
    } else total += ['J', 'Q', 'K'].includes(c.r) ? 10 : Number(c.r)
  }
  while (total > 21 && aces > 0) {
    total -= 10
    aces--
  }
  return total
}

const isNatural = (cards) => cards.length === 2 && handValue(cards) === 21
const show = (cards) => cards.map((c) => `${c.r}${c.s}`).join(' ')

// Bandar menarik sampai 17 (berhenti di soft 17)
function dealerPlay(deck, dealer) {
  while (handValue(dealer) < 17) dealer.push(deck.pop())
  return dealer
}

// Hasil akhir. payout = uang yang dikembalikan ke pemain (taruhan sudah dipotong di awal).
function settle(player, dealer, bet) {
  const p = handValue(player)
  const d = handValue(dealer)
  if (p > 21) return { outcome: 'bust', payout: 0 }
  if (isNatural(player) && !isNatural(dealer)) return { outcome: 'blackjack', payout: bet + Math.floor(bet * 1.5) }
  if (isNatural(dealer) && !isNatural(player)) return { outcome: 'lose', payout: 0 }
  if (d > 21 || p > d) return { outcome: 'win', payout: bet * 2 }
  if (p === d) return { outcome: 'push', payout: bet }
  return { outcome: 'lose', payout: 0 }
}

module.exports = { newDeck, handValue, isNatural, show, dealerPlay, settle }
