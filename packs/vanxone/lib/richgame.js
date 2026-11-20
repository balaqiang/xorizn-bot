// Helper bersama game berbasis tombol (rich message)
const { sendRich, richOrText } = require('./interactive')
const { rp, parseAmount } = require('./game')

// Kirim kartu game. Kalau pesan interaktif gagal / richMode dimatikan, jatuh ke teks + daftar perintah pengganti.
function sendGame(ctx, { body, buttons = [], mentions = [], media }) {
  const { sock, msg, from, config } = ctx
  const hints = buttons
    .map((b) => {
      try {
        const p = JSON.parse(b.buttonParamsJson)
        return b.name === 'quick_reply' ? `• ${p.display_text} → ${p.id}` : null
      } catch {
        return null
      }
    })
    .filter(Boolean)
  const fallback = hints.length ? `${body}\n\n${hints.join('\n')}` : body

  return richOrText(
    sock,
    from,
    msg,
    config,
    () => sendRich(sock, from, { media, body, footer: config.footer, buttons, mentions, quoted: msg }),
    fallback
  ).catch((err) => console.log('[RICHGAME] gagal kirim:', err.message))
}

// Validasi taruhan: { bet } atau { error }
function parseBet(raw, user, { min = 100, optional = false } = {}) {
  if (raw === undefined || raw === '') {
    return optional ? { bet: 0 } : { error: `Masukkan jumlah taruhan (minimal ${rp(min)}).` }
  }
  const bet = parseAmount(raw, user.money)
  if (!bet || bet < min) return { error: `Taruhan minimal ${rp(min)}.` }
  if (bet > user.money) return { error: `Money kamu tidak cukup. Money: ${rp(user.money)}` }
  return { bet }
}

// Penyimpanan sesi dengan masa berlaku (di memori)
function createSessions(ttlMs) {
  const map = new Map()
  return {
    get(key) {
      const s = map.get(key)
      if (s && Date.now() - s.at > ttlMs) {
        map.delete(key)
        return null
      }
      return s || null
    },
    set(key, value) {
      const s = { ...value, at: Date.now() }
      map.set(key, s)
      return s
    },
    touch(key) {
      const s = map.get(key)
      if (s) s.at = Date.now()
    },
    del: (key) => map.delete(key)
  }
}

module.exports = { sendGame, parseBet, createSessions }
