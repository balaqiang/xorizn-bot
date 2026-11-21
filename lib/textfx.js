const MORSE = { a: '.-', b: '-...', c: '-.-.', d: '-..', e: '.', f: '..-.', g: '--.', h: '....', i: '..', j: '.---', k: '-.-', l: '.-..', m: '--', n: '-.', o: '---', p: '.--.', q: '--.-', r: '.-.', s: '...', t: '-', u: '..-', v: '...-', w: '.--', x: '-..-', y: '-.--', z: '--..', 0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..', '/': '-..-.', '!': '-.-.--' }
const REV = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]))

const toMorse = (t) => [...t.toLowerCase()].map((c) => (c === ' ' ? '/' : MORSE[c] || '')).filter(Boolean).join(' ')
const fromMorse = (t) => t.trim().split(/\s+/).map((c) => (c === '/' ? ' ' : REV[c] || '?')).join('')
const isMorse = (t) => /^[.\-/\s]+$/.test(t.trim())

const toBinary = (t) => [...Buffer.from(t, 'utf8')].map((b) => b.toString(2).padStart(8, '0')).join(' ')
function fromBinary(t) {
  const parts = t.trim().split(/\s+/)
  if (!parts.every((p) => /^[01]{8}$/.test(p))) return null
  return Buffer.from(parts.map((p) => parseInt(p, 2))).toString('utf8')
}
const isBinary = (t) => /^[01\s]+$/.test(t.trim()) && /[01]{8}/.test(t)

const reverse = (t) => [...t].reverse().join('')
const mock = (t) => { let i = 0; return [...t].map((c) => (/[a-z]/i.test(c) ? (i++ % 2 ? c.toUpperCase() : c.toLowerCase()) : c)).join('') }

module.exports = { toMorse, fromMorse, isMorse, toBinary, fromBinary, isBinary, reverse, mock }
