// Alat matematika: faktor/prima, FPB-KPK, persen, statistik, basis bilangan, kombinasi/permutasi, fibonacci, persamaan kuadrat
const { panel, num, parseNum } = require('../../lib/uitext')

const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a }
const fmtBig = (b) => {
  const s = b.toString()
  return s.length <= 40 ? BigInt(s).toLocaleString('id-ID') : `${s[0]},${s.slice(1, 6)} × 10^${s.length - 1} (${s.length} digit)`
}

function factorize(n) {
  const f = new Map()
  for (let p = 2; p * p <= n; p += p === 2 ? 1 : 2) while (n % p === 0) { f.set(p, (f.get(p) || 0) + 1); n /= p }
  if (n > 1) f.set(n, (f.get(n) || 0) + 1)
  return f
}
const toNums = (args) => args.join(' ').replace(/;/g, ' ').split(/\s+/).filter(Boolean)
// angka dengan koma desimal; kalau hanya 1 token berkoma (1,2,3) → koma = pemisah
function readList(args) {
  const raw = args.join(' ').trim()
  const toks = /\s/.test(raw) || !raw.includes(',') ? toNums(args) : raw.split(',').map((x) => x.trim()).filter(Boolean)
  const vals = toks.map(parseNum)
  return vals.some((v) => v === null) ? null : vals
}
const nfmt = (v, d = 4) => num(v, d)

const BASE = { bin: 2, oct: 8, des: 10, dec: 10, hex: 16 }
const DIG = '0123456789abcdefghijklmnopqrstuvwxyz'
const toBase = (v) => BASE[String(v).toLowerCase()] || (/^\d+$/.test(v) && Number(v) >= 2 && Number(v) <= 36 ? Number(v) : null)

module.exports = {
  name: 'mathkit',
  command: ['faktor', 'fpbkpk', 'persen', 'statistik', 'basis', 'kombinasi', 'permutasi', 'fibonacci', 'kuadrat'],
  category: 'tools',
  emoji: '🧮',
  desc: 'Matematika: faktor, FPB-KPK, persen, statistik, basis, kombinasi, fibonacci, kuadrat',
  usage: '<angka...>',
  run: async ({ command, args, prefix, reply }) => {
    const need = (ex) => reply(`Format salah.\nContoh: ${prefix}${command} ${ex}`)

    if (command === 'faktor') {
      const n = Number(args[0])
      if (!Number.isInteger(n) || n < 2 || n > 1e14) return need('360   (bilangan bulat 2 sampai 100 triliun)')
      const f = factorize(n)
      const prime = f.size === 1 && [...f.values()][0] === 1
      const lines = [`Bilangan : ${n.toLocaleString('id-ID')}`, `Prima : ${prime ? '✅ Ya' : '❌ Bukan'}`]
      if (!prime) {
        lines.push(`Faktorisasi : ${[...f].map(([p, e]) => (e > 1 ? `${p}^${e}` : p)).join(' × ')}`)
        if (n <= 1e9) {
          const d = []
          for (let i = 1; i * i <= n; i++) if (n % i === 0) { d.push(i); if (i * i !== n) d.push(n / i) }
          d.sort((a, b) => a - b)
          lines.push(`Jumlah pembagi : ${d.length}`, `Pembagi : ${d.length > 40 ? `${d.slice(0, 40).join(', ')}, …` : d.join(', ')}`)
        }
      }
      return reply(panel('FAKTOR BILANGAN', [{ head: '🧮 *HASIL*', lines }]))
    }

    if (command === 'fpbkpk') {
      const v = args.map(Number)
      if (v.length < 2 || v.length > 10 || v.some((x) => !Number.isInteger(x) || x < 1 || x > 1e12)) return need('12 18 24')
      const g = v.reduce(gcd)
      const bg = (a, b) => { while (b) [a, b] = [b, a % b]; return a } // gcd BigInt (KPK bisa lebih besar dari 2^53)
      const l = v.map(BigInt).reduce((a, b) => (a / bg(a, b)) * b)
      return reply(panel('FPB & KPK', [{ head: '🧮 *HASIL*', lines: [`Bilangan : ${v.join(', ')}`, `*FPB : ${g.toLocaleString('id-ID')}*`, `*KPK : ${l.toLocaleString('id-ID')}*`] }]))
    }

    if (command === 'persen') {
      const a = args.map((x) => x.toLowerCase())
      let lines
      if (a.length === 3 && a[1] === 'dari') {
        const [x, y] = [parseNum(a[0]), parseNum(a[2])]
        if (x === null || y === null) return need('20 dari 500')
        lines = [`${nfmt(x)}% dari ${nfmt(y)} = *${nfmt((x / 100) * y)}*`]
      } else if (a.length === 3 && ['ubah', 'naik', 'turun', 'selisih'].includes(a[0])) {
        const [x, y] = [parseNum(a[1]), parseNum(a[2])]
        if (x === null || y === null || x === 0) return need('ubah 80 100')
        const c = ((y - x) / Math.abs(x)) * 100
        lines = [`Dari ${nfmt(x)} ke ${nfmt(y)}`, `Perubahan : *${c >= 0 ? '+' : ''}${nfmt(c)}%* (${c >= 0 ? 'naik' : 'turun'})`]
      } else if (a.length === 2) {
        const [x, y] = [parseNum(a[0]), parseNum(a[1])]
        if (x === null || y === null || y === 0) return need('50 200')
        lines = [`${nfmt(x)} adalah *${nfmt((x / y) * 100)}%* dari ${nfmt(y)}`]
      } else return reply(panel('KALKULATOR PERSEN', [{ head: '📖 *CARA PAKAI*', lines: [`${prefix}persen 20 dari 500  → 20% dari 500`, `${prefix}persen 50 200  → 50 itu berapa % dari 200`, `${prefix}persen ubah 80 100  → persen naik/turun`] }]))
      return reply(panel('KALKULATOR PERSEN', [{ head: '🧮 *HASIL*', lines, plain: true }]))
    }

    if (command === 'statistik') {
      const v = readList(args)
      if (!v || v.length < 2 || v.length > 500) return need('2 4 4 4 5 5 7 9')
      const n = v.length
      const sum = v.reduce((a, b) => a + b, 0)
      const mean = sum / n
      const s = [...v].sort((a, b) => a - b)
      const median = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2
      const cnt = new Map()
      v.forEach((x) => cnt.set(x, (cnt.get(x) || 0) + 1))
      const top = Math.max(...cnt.values())
      const modus = top === 1 ? 'tidak ada' : [...cnt].filter(([, c]) => c === top).map(([k]) => nfmt(k)).join(', ')
      const ss = v.reduce((a, b) => a + (b - mean) ** 2, 0)
      return reply(panel('STATISTIK', [{ head: '📊 *HASIL*', lines: [`Jumlah data : ${n}`, `Total : ${nfmt(sum)}`, `Rata-rata : ${nfmt(mean)}`, `Median : ${nfmt(median)}`, `Modus : ${modus}`, `Min / Maks : ${nfmt(s[0])} / ${nfmt(s[n - 1])}`, `Rentang : ${nfmt(s[n - 1] - s[0])}`, `Simpangan baku (populasi) : ${nfmt(Math.sqrt(ss / n))}`, `Simpangan baku (sampel) : ${nfmt(Math.sqrt(ss / (n - 1)))}`] }]))
    }

    if (command === 'basis') {
      const [val, from, to] = args
      const bf = toBase(from)
      const bt = toBase(to)
      if (!val || !bf || !bt) return reply(`Format: ${prefix}basis <angka> <dari> <ke>\nBasis: bin(2), oct(8), des(10), hex(16) atau angka 2-36.\nContoh: ${prefix}basis ff hex des\nContoh: ${prefix}basis 255 10 2`)
      let n = 0n
      for (const ch of val.toLowerCase().replace(/^0[xb]/, '')) {
        const d = DIG.indexOf(ch)
        if (d < 0 || d >= bf) return reply(`Digit "${ch}" tidak valid untuk basis ${bf}.`)
        n = n * BigInt(bf) + BigInt(d)
      }
      if (n.toString().length > 60) return reply('Angka terlalu besar.')
      return reply(panel('KONVERSI BASIS', [{ head: '🧮 *HASIL*', lines: [`${val} (basis ${bf})`, `= *${n.toString(bt).toUpperCase()}* (basis ${bt})`, bt !== 10 && bf !== 10 && `Desimal : ${n.toString(10)}`].filter(Boolean), plain: true }]))
    }

    if (command === 'kombinasi' || command === 'permutasi') {
      const [n, r] = args.map(Number)
      if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n || n > 500) return need('10 3   (n ≥ r ≥ 0, n maks 500)')
      let p = 1n
      for (let i = 0; i < r; i++) p *= BigInt(n - i)
      let rf = 1n
      for (let i = 2n; i <= BigInt(r); i++) rf *= i
      const hasil = command === 'permutasi' ? p : p / rf
      return reply(panel(command === 'permutasi' ? 'PERMUTASI' : 'KOMBINASI', [{ head: '🧮 *HASIL*', lines: [`${command === 'permutasi' ? 'P' : 'C'}(${n}, ${r}) = *${fmtBig(hasil)}*`], plain: true }]))
    }

    if (command === 'fibonacci') {
      const n = Number(args[0])
      if (!Number.isInteger(n) || n < 0 || n > 1000) return need('10   (0 sampai 1000)')
      let [a, b] = [0n, 1n] // a = F(i)
      const seq = []
      for (let i = 0; i < n; i++) {
        if (i < 14) seq.push(a)
        ;[a, b] = [b, a + b]
      }
      if (n < 14 || n === 14) seq.push(a) // sertakan F(n) bila masih dalam deret awal
      return reply(panel('FIBONACCI', [{ head: '🧮 *HASIL*', lines: [`F(${n}) = *${fmtBig(a)}*`, `Deret awal : ${seq.join(', ')}${n > 14 ? ', …' : ''}`], plain: true }]))
    }

    // kuadrat: ax² + bx + c = 0
    const [A, B, C] = args.map(parseNum)
    if ([A, B, C].some((x) => x === null || x === undefined) || A === 0) return need('1 -3 2   (untuk x² − 3x + 2 = 0; a tidak boleh 0)')
    const D = B * B - 4 * A * C
    const vx = -B / (2 * A)
    const lines = [`Persamaan : ${nfmt(A)}x² ${B < 0 ? '−' : '+'} ${nfmt(Math.abs(B))}x ${C < 0 ? '−' : '+'} ${nfmt(Math.abs(C))} = 0`, `Diskriminan (D) : ${nfmt(D)}`]
    if (D > 0) lines.push(`*x₁ = ${nfmt((-B + Math.sqrt(D)) / (2 * A))}*`, `*x₂ = ${nfmt((-B - Math.sqrt(D)) / (2 * A))}*`)
    else if (D === 0) lines.push(`*x = ${nfmt(vx)}* (akar kembar)`)
    else lines.push(`Akar imajiner:`, `*x₁ = ${nfmt(vx)} + ${nfmt(Math.sqrt(-D) / Math.abs(2 * A))}i*`, `*x₂ = ${nfmt(vx)} − ${nfmt(Math.sqrt(-D) / Math.abs(2 * A))}i*`)
    lines.push(`Titik puncak : (${nfmt(vx)}, ${nfmt(A * vx * vx + B * vx + C)})`)
    return reply(panel('PERSAMAAN KUADRAT', [{ head: '🧮 *HASIL*', lines, plain: true }]))
  }
}
