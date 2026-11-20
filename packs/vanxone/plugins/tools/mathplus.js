// Matematika lanjutan: pecahan, matriks, turunan & integral polinom, PPN, vigenere
const kit = require('../../lib/kit')
const { panel, num } = require('../../lib/uitext')

const fail = (msg) => Object.assign(new Error(msg), { userMessage: msg })
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a }

// ---------- pecahan ----------
class Fr {
  constructor(n, d = 1n) {
    if (d === 0n) throw fail('Penyebut tidak boleh 0.')
    if (d < 0n) { n = -n; d = -d }
    const g = gcd(n, d) || 1n
    this.n = n / g
    this.d = d / g
  }
  add(o) { return new Fr(this.n * o.d + o.n * this.d, this.d * o.d) }
  sub(o) { return new Fr(this.n * o.d - o.n * this.d, this.d * o.d) }
  mul(o) { return new Fr(this.n * o.n, this.d * o.d) }
  div(o) { if (o.n === 0n) throw fail('Tidak bisa dibagi 0.'); return new Fr(this.n * o.d, this.d * o.n) }
  toString() { return this.d === 1n ? `${this.n}` : `${this.n}/${this.d}` }
  get value() { return Number(this.n) / Number(this.d) }
}
function parseFr(s) {
  s = s.trim()
  let m = s.match(/^(-?\d+)\s*\+?\s*(\d+)\/(\d+)$/) // campuran: 2 1/3 (dengan spasi)
  if (m && /\s/.test(s)) { const w = BigInt(m[1]); const f = new Fr(BigInt(m[2]), BigInt(m[3])); return w < 0n || s.startsWith('-') ? new Fr(w * f.d - f.n, f.d) : new Fr(w * f.d + f.n, f.d) }
  m = s.match(/^(-?\d+)\/(-?\d+)$/)
  if (m) return new Fr(BigInt(m[1]), BigInt(m[2]))
  m = s.match(/^(-?)(\d+)(?:[.,](\d+))?$/)
  if (m) { const dec = m[3] || ''; return new Fr(BigInt(`${m[1]}${m[2]}${dec}`), 10n ** BigInt(dec.length)) }
  throw fail(`"${s}" bukan pecahan/bilangan yang valid.`)
}
function pecahan(text) {
  const m = text.match(/^(.+?)\s*([+\-*x×÷:])\s*(.+)$/) // operator dengan spasi di kedua sisi dianggap operator
  const spaced = text.match(/^(\S+(?:\s\d+\/\d+)?)\s+([+\-*x×÷:/])\s+(\S+(?:\s\d+\/\d+)?)$/)
  let result
  let shown
  if (spaced) {
    const a = parseFr(spaced[1])
    const b = parseFr(spaced[3])
    const op = spaced[2]
    result = op === '+' ? a.add(b) : op === '-' ? a.sub(b) : /[*x×]/.test(op) ? a.mul(b) : a.div(b)
    shown = `${a} ${op} ${b}`
  } else {
    void m
    result = parseFr(text)
    shown = text
  }
  const whole = result.n / result.d
  const rem = (result.n < 0n ? -result.n : result.n) % result.d
  const mixed = result.d === 1n ? `${result.n}` : whole === 0n ? `${result}` : `${whole} ${rem}/${result.d}`
  return panel('PECAHAN', [
    { head: '🧮 *HASIL*', lines: [`Soal : ${shown}`, `Bentuk sederhana : ${result}`, `Campuran : ${mixed}`, `Desimal : ${num(result.value, 8)}`, `Persen : ${num(result.value * 100, 6)}%`] }
  ], { tip: '💡 Operasi: pakai spasi, mis. 1/2 + 1/3 atau 2 1/4 x 3' })
}

// ---------- matriks ----------
function parseMatrix(s) {
  let arr
  try { arr = JSON.parse(s.replace(/;/g, '],[').replace(/^\s*\[?\s*(?!\[)/, (x) => x)) } catch { arr = null }
  if (!Array.isArray(arr)) {
    try { arr = JSON.parse(`[${s.trim().replace(/^\[\s*(?=\[)/, '').replace(/(?<=\])\s*\]$/, '')}]`) } catch { arr = null }
  }
  if (Array.isArray(arr) && arr.length && !Array.isArray(arr[0])) arr = [arr]
  if (!Array.isArray(arr) || !arr.length || !arr.every((r) => Array.isArray(r) && r.length === arr[0].length && r.every((v) => typeof v === 'number' && Number.isFinite(v)))) throw fail('Format matriks salah. Contoh: [[1,2],[3,4]] — setiap baris harus sama panjang.')
  if (arr.length > 6 || arr[0].length > 6) throw fail('Ukuran matriks maksimal 6×6.')
  return arr
}
const fmtM = (m) => m.map((r) => r.map((v) => num(v, 4)).join('   ')).join('\n')
const mdet = (a) => {
  const n = a.length
  const m = a.map((r) => [...r])
  let d = 1
  for (let i = 0; i < n; i++) {
    let p = i
    for (let r = i + 1; r < n; r++) if (Math.abs(m[r][i]) > Math.abs(m[p][i])) p = r
    if (Math.abs(m[p][i]) < 1e-12) return 0
    if (p !== i) { [m[p], m[i]] = [m[i], m[p]]; d = -d }
    d *= m[i][i]
    for (let r = i + 1; r < n; r++) { const f = m[r][i] / m[i][i]; for (let c = i; c < n; c++) m[r][c] -= f * m[i][c] }
  }
  return d
}
function minv(a) {
  const n = a.length
  const m = a.map((r, i) => [...r, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))])
  for (let i = 0; i < n; i++) {
    let p = i
    for (let r = i + 1; r < n; r++) if (Math.abs(m[r][i]) > Math.abs(m[p][i])) p = r
    if (Math.abs(m[p][i]) < 1e-12) throw fail('Matriks singular (determinan 0), tidak punya invers.')
    ;[m[p], m[i]] = [m[i], m[p]]
    const d = m[i][i]
    for (let c = 0; c < 2 * n; c++) m[i][c] /= d
    for (let r = 0; r < n; r++) if (r !== i) { const f = m[r][i]; for (let c = 0; c < 2 * n; c++) m[r][c] -= f * m[i][c] }
  }
  return m.map((r) => r.slice(n))
}
function matriks(text) {
  const mt = text.trim().match(/^(det|inv|invers|transpose|trans|kali|tambah|kurang)\s+([\s\S]+)$/i)
  if (!mt) throw fail('Contoh:\n.matriks det [[1,2],[3,4]]\n.matriks inv [[2,1],[1,1]]\n.matriks trans [[1,2,3],[4,5,6]]\n.matriks kali [[1,2],[3,4]] [[5,6],[7,8]]')
  const op = mt[1].toLowerCase()
  const parts = mt[2].split(/\]\s+\[/).length > 1 && /kali|tambah|kurang/.test(op) ? mt[2].split(/(?<=\])\s+(?=\[)/) : [mt[2]]
  const A = parseMatrix(parts[0])
  const head = `Matriks A (${A.length}×${A[0].length})\n${fmtM(A)}`
  if (op === 'det') { if (A.length !== A[0].length) throw fail('Determinan butuh matriks persegi.'); return panel('MATRIKS', [{ head: '🧮 *DETERMINAN*', lines: [head.replace(/\n/g, ' | '), `det(A) = ${num(mdet(A), 6)}`], plain: true }]) }
  if (op === 'inv' || op === 'invers') { if (A.length !== A[0].length) throw fail('Invers butuh matriks persegi.'); return `*INVERS MATRIKS*\n\n${head}\n\nA⁻¹ =\n${fmtM(minv(A))}` }
  if (op === 'trans' || op === 'transpose') return `*TRANSPOSE*\n\n${head}\n\nAᵀ =\n${fmtM(A[0].map((_, c) => A.map((r) => r[c])))}`
  if (!parts[1]) throw fail('Operasi ini butuh dua matriks: .matriks kali [[..]] [[..]]')
  const B = parseMatrix(parts[1])
  if (op === 'kali') {
    if (A[0].length !== B.length) throw fail(`Kolom A (${A[0].length}) harus sama dengan baris B (${B.length}).`)
    return `*PERKALIAN MATRIKS*\n\nA\n${fmtM(A)}\n\nB\n${fmtM(B)}\n\nA × B =\n${fmtM(A.map((r) => B[0].map((_, c) => r.reduce((s, v, k) => s + v * B[k][c], 0))))}`
  }
  if (A.length !== B.length || A[0].length !== B[0].length) throw fail('Ukuran kedua matriks harus sama.')
  const sg = op === 'tambah' ? 1 : -1
  return `*${op === 'tambah' ? 'PENJUMLAHAN' : 'PENGURANGAN'} MATRIKS*\n\n${fmtM(A.map((r, i) => r.map((v, j) => v + sg * B[i][j])))}`
}

// ---------- polinom: turunan & integral ----------
function parsePoly(s) {
  const src = s.replace(/\s+/g, '').replace(/−/g, '-').replace(/\*\*/g, '^').replace(/\*/g, '')
  if (!/^[0-9xX+\-^.,/()]+$/.test(src) || !src) throw fail('Hanya mendukung polinom dalam x, contoh: 3x^2+2x-5')
  const terms = new Map()
  const re = /([+-]?)(\d+(?:[.,]\d+)?(?:\/\d+)?)?(x(?:\^(-?\d+))?)?/gi
  let m
  let pos = 0
  while (pos < src.length && (m = re.exec(src)) !== null) {
    if (m[0] === '') { re.lastIndex++; continue }
    if (m.index !== pos) throw fail('Bentuk polinom tidak dikenali. Contoh: 3x^2+2x-5')
    pos = re.lastIndex
    if (m[2] === undefined && m[3] === undefined) throw fail('Bentuk polinom tidak dikenali.')
    let c = m[2] === undefined ? 1 : m[2].includes('/') ? Number(m[2].split('/')[0]) / Number(m[2].split('/')[1]) : Number(m[2].replace(',', '.'))
    if (m[1] === '-') c = -c
    const e = m[3] === undefined ? 0 : m[4] === undefined ? 1 : Number(m[4])
    terms.set(e, (terms.get(e) || 0) + c)
  }
  if (pos !== src.length) throw fail('Bentuk polinom tidak dikenali. Contoh: 3x^2+2x-5')
  return terms
}
const nfmt = (v) => {
  if (Number.isInteger(v)) return `${v}`
  const a = Math.abs(v)
  for (let d = 2; d <= 12; d++) if (Math.abs(a * d - Math.round(a * d)) < 1e-9) return `${v < 0 ? '-' : ''}${Math.round(a * d)}/${d}`
  return `${Math.round(v * 1e6) / 1e6}`
}
function polyStr(terms) {
  const ks = [...terms.keys()].filter((k) => Math.abs(terms.get(k)) > 1e-12).sort((a, b) => b - a)
  if (!ks.length) return '0'
  return ks.map((k, i) => {
    const c = terms.get(k)
    const abs = Math.abs(c)
    const cs = nfmt(abs)
    const body = k === 0 ? cs : `${abs === 1 ? '' : cs.includes('/') ? `(${cs})` : cs}x${k === 1 ? '' : `^${k}`}`
    return `${i === 0 ? (c < 0 ? '-' : '') : c < 0 ? ' - ' : ' + '}${body}`
  }).join('')
}
const evalPoly = (t, x) => [...t].reduce((s, [e, c]) => s + c * x ** e, 0)
function turunan(text) {
  const t = parsePoly(text)
  const d = new Map()
  for (const [e, c] of t) if (e !== 0) d.set(e - 1, (d.get(e - 1) || 0) + c * e)
  return panel('TURUNAN', [{ head: '📐 *HASIL*', lines: [`f(x) = ${polyStr(t)}`, `f'(x) = ${polyStr(d)}`] }])
}
function integral(text) {
  const mt = text.trim().match(/^(.+?)(?:\s+(?:dari\s+)?(-?[\d.,]+)\s*(?:sampai|s\/d|ke|to|-)\s*(-?[\d.,]+))?$/i)
  const t = parsePoly(mt[1])
  const I = new Map()
  for (const [e, c] of t) {
    if (e === -1) throw fail('Suku x^-1 menghasilkan ln|x| — belum didukung.')
    I.set(e + 1, (I.get(e + 1) || 0) + c / (e + 1))
  }
  const lines = [`f(x) = ${polyStr(t)}`, `∫ f(x) dx = ${polyStr(I)} + C`]
  if (mt[2] !== undefined) {
    const a = Number(mt[2].replace(',', '.'))
    const b = Number(mt[3].replace(',', '.'))
    lines.push(`∫[${a}→${b}] f(x) dx = ${nfmt(Math.round((evalPoly(I, b) - evalPoly(I, a)) * 1e8) / 1e8)}`)
  }
  return panel('INTEGRAL', [{ head: '📐 *HASIL*', lines }], { tip: '💡 Integral tentu: .integral x^2+1 dari 0 sampai 3' })
}

// ---------- PPN ----------
function ppn(args) {
  const { parseMoney } = require('../../lib/uitext')
  const inc = args.some((a) => /^-?(inc|include|termasuk)$/i.test(a))
  const rest = args.filter((a) => !/^-?(inc|include|termasuk)$/i.test(a))
  const v = parseMoney(rest[0])
  const pct = rest[1] !== undefined ? Number(String(rest[1]).replace('%', '').replace(',', '.')) : 11
  if (v === null || !Number.isFinite(pct) || pct < 0 || pct > 100) throw fail('Contoh: .ppn 1jt  |  .ppn 500rb 12  |  .ppn 1110000 inc  (harga sudah termasuk PPN)')
  const base = inc ? v / (1 + pct / 100) : v
  const tax = base * (pct / 100)
  const { rp } = require('../../lib/uitext')
  return panel('PPN', [{ head: '🧾 *RINCIAN*', lines: [`Tarif : ${pct}%`, `Harga sebelum PPN : ${rp(base)}`, `PPN : ${rp(tax)}`, `Total : ${rp(base + tax)}`] }], { tip: '💡 Tarif PPN umum 11% (bawaan). Tambah "inc" bila harga sudah termasuk PPN.' })
}

// ---------- teks ----------
function vigenere(text, decode) {
  const m = text.match(/^(\S+)\s+([\s\S]+)$/)
  if (!m) throw fail('Contoh: .vigenere KUNCI teks rahasia\nDekode: .vigenere -d KUNCI teks sandi')
  const key = m[1].toLowerCase().replace(/[^a-z]/g, '')
  if (!key) throw fail('Kunci hanya boleh berisi huruf a-z.')
  let k = 0
  return [...m[2]].map((ch) => {
    const code = ch.charCodeAt(0)
    const base = code >= 65 && code <= 90 ? 65 : code >= 97 && code <= 122 ? 97 : 0
    if (!base) return ch
    const shift = key.charCodeAt(k++ % key.length) - 97
    return String.fromCharCode(((code - base + (decode ? 26 - shift : shift)) % 26) + base)
  }).join('')
}

const need = (c) => kit.rest(c.body).trim()
const specs = {
  pecahan: { desc: 'Sederhanakan & hitung pecahan (campuran, desimal, persen)', usage: '<pecahan | a op b>', example: '6/8  atau  1/2 + 1/3', args: true, run: async (c) => pecahan(need(c)) },
  matriks: { desc: 'Matriks: determinan, invers, transpose, kali, tambah, kurang', usage: '<operasi> [[..]] [[..]]', example: 'det [[1,2],[3,4]]', args: true, run: async (c) => matriks(need(c)) },
  turunan: { desc: 'Turunan polinom', usage: '<polinom>', example: '3x^2+2x-5', args: true, run: async (c) => turunan(need(c)) },
  integral: { desc: 'Integral polinom (tak tentu & tentu)', usage: '<polinom> [dari a sampai b]', example: 'x^2+1 dari 0 sampai 3', args: true, run: async (c) => integral(need(c)) },
  ppn: { desc: 'Hitung PPN (tambah atau pisahkan dari harga)', usage: '<harga> [persen] [inc]', example: '1jt', args: true, run: async (c) => ppn(c.args) },
  vigenere: { desc: 'Sandi Vigenere (enkripsi/dekripsi dengan kunci)', usage: '[-d] <kunci> <teks>', example: 'KUNCI halo dunia', args: true, run: async (c) => {
    const t = need(c)
    const dec = /^-d\s/.test(t)
    return `*VIGENERE ${dec ? 'DEKODE' : 'ENKODE'}*\n${vigenere(dec ? t.slice(3) : t, dec)}`
  } }
}

module.exports = kit.multi({ name: 'mathplus', category: 'tools', emoji: '➗', desc: 'Matematika lanjutan', specs })
