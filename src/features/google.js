/**
 * Text-to-speech & terjemahan memakai endpoint publik Google Translate (tanpa API key).
 */
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

/** Nama bahasa (Indonesia/Inggris) → kode. Kode langsung juga diterima. */
export const LANGS = {
  indonesia: 'id', indo: 'id', id: 'id',
  inggris: 'en', english: 'en', en: 'en',
  jepang: 'ja', japan: 'ja', ja: 'ja',
  korea: 'ko', ko: 'ko',
  arab: 'ar', ar: 'ar',
  mandarin: 'zh-CN', cina: 'zh-CN', china: 'zh-CN', zh: 'zh-CN', 'zh-cn': 'zh-CN',
  jawa: 'jw', jw: 'jw', jv: 'jw',
  sunda: 'su', su: 'su',
  melayu: 'ms', malaysia: 'ms', ms: 'ms',
  spanyol: 'es', es: 'es',
  prancis: 'fr', perancis: 'fr', fr: 'fr',
  jerman: 'de', de: 'de',
  rusia: 'ru', ru: 'ru',
  india: 'hi', hindi: 'hi', hi: 'hi',
  thailand: 'th', thai: 'th', th: 'th',
  vietnam: 'vi', vi: 'vi',
  portugis: 'pt', pt: 'pt',
  italia: 'it', it: 'it',
  turki: 'tr', tr: 'tr',
  belanda: 'nl', nl: 'nl',
  filipina: 'tl', tagalog: 'tl', tl: 'tl'
}
export const langCode = (s) => LANGS[String(s || '').toLowerCase()] || null

/** Pecah teks jadi potongan ≤ max karakter, sebisa mungkin di batas kalimat / spasi. */
export function chunkText(text, max = 190) {
  const out = []
  let rest = String(text).replace(/\s+/g, ' ').trim()
  while (rest.length > max) {
    let cut = Math.max(rest.lastIndexOf('. ', max), rest.lastIndexOf('! ', max), rest.lastIndexOf('? ', max), rest.lastIndexOf(', ', max))
    if (cut < max * 0.5) cut = rest.lastIndexOf(' ', max)
    if (cut <= 0) cut = max
    out.push(rest.slice(0, cut + 1).trim())
    rest = rest.slice(cut + 1).trim()
  }
  if (rest) out.push(rest)
  return out
}

/** Teks → MP3 (Buffer). */
export async function tts(text, lang = 'id') {
  const parts = chunkText(text)
  if (!parts.length) throw new Error('Teks kosong.')
  const bufs = []
  for (let i = 0; i < parts.length; i++) {
    const q = parts[i]
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(q)}&total=${parts.length}&idx=${i}&textlen=${q.length}`
    const res = await fetch(url, { headers: { 'User-Agent': UA, Referer: 'https://translate.google.com/' }, signal: AbortSignal.timeout(20000) })
    if (!res.ok) throw new Error(res.status === 400 ? 'Bahasa tidak didukung untuk suara.' : `Layanan suara sedang gangguan (HTTP ${res.status}).`)
    bufs.push(Buffer.from(await res.arrayBuffer()))
  }
  return Buffer.concat(bufs)
}

/** Terjemahkan teks. Mengembalikan { text, from }. */
export async function translate(text, to = 'id', from = 'auto') {
  const out = []
  let detected = from
  for (const part of chunkText(text, 1500)) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(from)}&tl=${encodeURIComponent(to)}&dt=t&q=${encodeURIComponent(part)}`
    const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(20000) })
    if (!res.ok) throw new Error(`Layanan terjemahan sedang gangguan (HTTP ${res.status}).`)
    const data = await res.json()
    out.push((data?.[0] || []).map((x) => x?.[0] || '').join(''))
    if (typeof data?.[2] === 'string') detected = data[2]
  }
  return { text: out.join(' ').trim(), from: detected }
}
