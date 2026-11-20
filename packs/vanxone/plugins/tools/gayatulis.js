// 27 gaya tulisan Unicode: .script .fraktur .doublestruck .upsidedown .coret .zalgo .leet ... + .semuagaya
const { getQuotedText } = require('../../lib/utils')

// ubah huruf/angka ASCII ke blok Unicode (pengecualian = huruf yang punya kode terpisah)
const range = (text, upper, lower, digit, ex = {}) =>
  [...text]
    .map((ch) => {
      if (ex[ch]) return ex[ch]
      const c = ch.codePointAt(0)
      if (c >= 65 && c <= 90 && upper) return String.fromCodePoint(upper + c - 65)
      if (c >= 97 && c <= 122 && lower) return String.fromCodePoint(lower + c - 97)
      if (c >= 48 && c <= 57 && digit) return String.fromCodePoint(digit + c - 48)
      return ch
    })
    .join('')
const table = (text, map) => [...text].map((c) => map[c] ?? map[c.toLowerCase()] ?? c).join('')
const combine = (mark) => (t) => [...t].map((c) => (/\s/.test(c) ? c : c + mark)).join('')
const fromStr = (a, b) => Object.fromEntries([...a].map((c, i) => [c, [...b][i]]))

const SCRIPT_UP = { B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ' }
const SCRIPT_LO = { e: 'ℯ', g: 'ℊ', o: 'ℴ' }
const FRAK_UP = { C: 'ℭ', H: 'ℌ', I: 'ℑ', R: 'ℜ', Z: 'ℨ' }
const DS_UP = { C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ' }

const SUP = { ...fromStr('abcdefghijklmnoprstuvwxyz', 'ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖʳˢᵗᵘᵛʷˣʸᶻ'), ...fromStr('0123456789+-=()', '⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾') }
const SUB = { ...fromStr('aehijklmnoprstuvx', 'ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓ'), ...fromStr('0123456789+-=()', '₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎') }
const FLIP = {
  ...fromStr('abcdefghijklmnopqrstuvwxyz', 'ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz'),
  ...fromStr('ABCDEFGHIJKLMNOPQRSTUVWXYZ', '∀ᗺƆᗡƎℲ⅁HIſ⋊˥WNOԀΌᴚS⊥∩ΛMX⅄Z'),
  ...fromStr('0123456789', '0ƖᄅƐㄣϛ9ㄥ86'),
  ...fromStr('.,?!()[]{}<>_&', '˙\'¿¡)(][}{><‾⅋')
}
const LEET = { a: '4', e: '3', i: '1', o: '0', s: '5', t: '7', b: '8', g: '9', z: '2' }

const ZALGO_UP = ['\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310', '\u0352', '\u0357', '\u0351', '\u0307', '\u0308', '\u030a', '\u0342', '\u0343', '\u0344', '\u034a', '\u034b', '\u034c', '\u0303', '\u0302', '\u030c', '\u0350', '\u0300', '\u0301', '\u030b', '\u030f', '\u0312', '\u0313', '\u0314', '\u033d', '\u0309', '\u0363']
const ZALGO_DN = ['\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e', '\u031f', '\u0320', '\u0324', '\u0325', '\u0326', '\u0329', '\u032a', '\u032b', '\u032c', '\u032d', '\u032e', '\u032f', '\u0330', '\u0331', '\u0332', '\u0333', '\u0339', '\u033a', '\u033b', '\u033c', '\u0345', '\u0347', '\u0348', '\u0349', '\u034d', '\u034e', '\u0353', '\u0354', '\u0355', '\u0356', '\u0359', '\u035a', '\u0323']
const rnd = (a) => a[Math.floor(Math.random() * a.length)]
const zalgo = (t) => [...t].map((c) => (/\s/.test(c) ? c : c + rnd(ZALGO_UP) + rnd(ZALGO_UP) + rnd(ZALGO_DN) + rnd(ZALGO_DN))).join('')

const alay = (t) => {
  let i = 0
  return [...t].map((c) => {
    if (!/[a-z]/i.test(c)) return c
    const up = i++ % 2 === 0
    const l = c.toLowerCase()
    return !up && 'aeio'.includes(l) ? LEET[l] : up ? c.toUpperCase() : l
  }).join('')
}

const STYLES = {
  script: ['Script', (t) => range(t, 0x1d49c, 0x1d4b6, 0, { ...SCRIPT_UP, ...SCRIPT_LO })],
  boldscript: ['Bold Script', (t) => range(t, 0x1d4d0, 0x1d4ea, 0x1d7ce)],
  fraktur: ['Fraktur', (t) => range(t, 0x1d504, 0x1d51e, 0, FRAK_UP)],
  boldfraktur: ['Bold Fraktur', (t) => range(t, 0x1d56c, 0x1d586, 0x1d7ce)],
  doublestruck: ['Double-Struck', (t) => range(t, 0x1d538, 0x1d552, 0x1d7d8, DS_UP)],
  sans: ['Sans', (t) => range(t, 0x1d5a0, 0x1d5ba, 0x1d7e2)],
  sansitalic: ['Sans Italic', (t) => range(t, 0x1d608, 0x1d622, 0x1d7e2)],
  sansbolditalic: ['Sans Bold Italic', (t) => range(t, 0x1d63c, 0x1d656, 0x1d7ec)],
  squared: ['Kotak', (t) => range(t.toUpperCase(), 0x1f130, 0, 0)],
  negsquared: ['Kotak Hitam', (t) => range(t.toUpperCase(), 0x1f170, 0, 0)],
  negcircled: ['Bulat Hitam', (t) => range(t.toUpperCase(), 0x1f150, 0, 0)],
  bracketed: ['Kurung', (t) => range(t.toLowerCase(), 0, 0x249c, 0).replace(/[1-9]/g, (d) => String.fromCodePoint(0x2474 + Number(d) - 1))],
  fullwidth: ['Fullwidth', (t) => [...t].map((c) => (c === ' ' ? '\u3000' : c >= '!' && c <= '~' ? String.fromCodePoint(c.codePointAt(0) + 0xfee0) : c)).join('')],
  superscript: ['Superskrip', (t) => table(t, SUP)],
  subscript: ['Subskrip', (t) => table(t, SUB)],
  upsidedown: ['Terbalik', (t) => [...table(t, FLIP)].reverse().join('')],
  coret: ['Coret', combine('\u0336')],
  garisbawah: ['Garis bawah', combine('\u0332')],
  garisganda: ['Garis bawah ganda', combine('\u0333')],
  coretmiring: ['Coret miring', combine('\u0338')],
  garisatas: ['Garis atas', combine('\u0305')],
  spasi: ['Spasi lebar', (t) => [...t].join(' ')],
  titiktitik: ['Titik pemisah', (t) => [...t].join('·')],
  zalgo: ['Zalgo', zalgo],
  leet: ['Leet 1337', (t) => table(t, LEET)],
  alay: ['Alay', alay]
}

module.exports = {
  name: 'gayatulis',
  command: [...Object.keys(STYLES), 'semuagaya'],
  category: 'tools',
  emoji: '✍️',
  desc: '27 gaya tulisan unik: script, fraktur, terbalik, coret, zalgo, leet, alay, dll',
  usage: '<teks> (atau reply pesan)',
  run: async ({ msg, command, body, prefix, reply }) => {
    let text = String(body || '').replace(/^\S+[ \t]*/, '')
    if (!text.trim()) text = getQuotedText(msg) || ''
    if (!text.trim()) return reply(`Tulis teksnya atau reply pesan.\nContoh: ${prefix}${command === 'semuagaya' ? 'semuagaya' : command} Halo Dunia\nLihat semua gaya: ${prefix}semuagaya Halo`)
    if (command === 'semuagaya') {
      if (text.length > 30) return reply('Untuk pratinjau semua gaya, teks maksimal 30 karakter.')
      return reply(Object.entries(STYLES).map(([k, [name, fn]]) => `*${prefix}${k}* (${name})\n${fn(text)}`).join('\n\n'))
    }
    if (text.length > 500) return reply('Teks terlalu panjang (maks 500 karakter).')
    await reply(STYLES[command][1](text))
  }
}
module.exports.STYLES = STYLES
