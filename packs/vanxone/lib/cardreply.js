// Jalur cadangan untuk kartu interaktif: pengguna cukup MEMBALAS kartu dengan angka / kata kunci
// (mis. "1", "audio", "tinggi"). Berguna kalau tombol tidak merespons di perangkat tertentu.
const cards = new Map() // stanzaId -> { map, at }
const TTL = 30 * 60 * 1000
const MAX = 600

// "▶️ Putar (Audio)" -> ["putar", "audio", "putar audio"] ; "Tinggi (23%)" -> ["tinggi"]
function keywords(label) {
  const clean = (s) => s.replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim().toLowerCase()
  const paren = (label.match(/\(([^)]*)\)/) || [])[1]
  const base = clean(label.replace(/\([^)]*\)/g, ''))
  const out = []
  if (base) out.push(base, base.split(' ')[0])
  if (paren && /[a-z]/i.test(paren)) out.push(clean(paren))
  if (base && paren && /[a-z]/i.test(paren)) out.push(`${base} ${clean(paren)}`)
  return [...new Set(out.filter(Boolean))]
}

// buttons: array tombol nativeFlow. Hanya quick_reply yang dihitung.
function analyze(buttons) {
  const map = {}
  const labels = []
  let n = 0
  for (const b of buttons || []) {
    if (b.name !== 'quick_reply') continue
    let p
    try { p = JSON.parse(b.buttonParamsJson) } catch { continue }
    if (!p.id) continue
    n++
    map[String(n)] = p.id
    labels.push({ n, text: keywords(p.display_text || '')[0] || `opsi ${n}`, id: p.id })
    for (const k of keywords(p.display_text || '')) if (!(k in map)) map[k] = p.id
  }
  return { map, labels }
}

function register(stanzaId, buttons) {
  const { map, labels } = analyze(buttons)
  if (!stanzaId || !labels.length) return labels
  cards.set(stanzaId, { map, at: Date.now() })
  if (cards.size > MAX) cards.delete(cards.keys().next().value)
  return labels
}

const unwrap = (m) => m?.ephemeralMessage?.message || m?.viewOnceMessage?.message || m

function quotedId(msg) {
  const m = unwrap(msg?.message)
  const ctx = m?.extendedTextMessage?.contextInfo || m?.conversation?.contextInfo
  return ctx?.stanzaId || null
}

// Kembalikan perintah (mis. ".ytmp3 https://...") bila pesan ini balasan sah ke sebuah kartu.
function resolve(msg, body) {
  const id = quotedId(msg)
  if (!id) return null
  const card = cards.get(id)
  if (!card || Date.now() - card.at > TTL) return null
  const key = String(body || '').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim()
  return key ? card.map[key] || null : null
}

// Apakah pesan ini balasan tombol interaktif?
function isTap(msg) {
  const m = unwrap(msg?.message) || {}
  return !!(m.interactiveResponseMessage || m.templateButtonReplyMessage || m.buttonsResponseMessage || m.listResponseMessage)
}

// Cadangan bila paramsJson tak memuat id: cari tombol dengan teks yang sama pada kartu yang dibalas
function lookupByLabel(msg, label) {
  const m = unwrap(msg?.message) || {}
  const card = cards.get(m.interactiveResponseMessage?.contextInfo?.stanzaId)
  if (!card || !label) return null
  for (const k of keywords(String(label))) if (card.map[k]) return card.map[k]
  return null
}

const hintLine = (labels) =>
  labels.length ? `\n\n💬 _Tombol tidak merespons? Balas pesan ini:_ ${labels.slice(0, 5).map((l) => `*${l.n}* ${l.text}`).join(' • ')}` : ''

module.exports = { isTap, lookupByLabel, analyze, register, resolve, quotedId, keywords, hintLine, cards }
