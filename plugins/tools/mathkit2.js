// Matematika tambahan: bilangan prima, tabel perkalian, akar, pangkat, logaritma, trigonometri, derajat-radian
const { panel, num, parseNum } = require('../../lib/uitext')

const fix = (v) => (Math.abs(v) < 1e-12 ? 0 : Number(v.toPrecision(12)))
const f = (v, d = 6) => num(fix(v), d)

function sieve(n) {
  const s = new Uint8Array(n + 1)
  const out = []
  for (let i = 2; i <= n; i++) {
    if (!s[i]) {
      out.push(i)
      for (let j = i * i; j <= n; j += i) s[j] = 1
    }
  }
  return out
}
// sederhanakan akar kuadrat bilangan bulat: 72 -> 6√2
function simplifySqrt(n) {
  let out = 1
  let rest = n
  for (let p = 2; p * p <= rest; p++) while (rest % (p * p) === 0) { out *= p; rest /= p * p }
  return { out, rest }
}

module.exports = {
  name: 'mathkit2',
  command: ['prima', 'tabelkali', 'akar', 'pangkat', 'logaritma', 'trigono', 'derajat'],
  category: 'tools',
  emoji: '➗',
  desc: 'Bilangan prima, tabel perkalian, akar, pangkat, logaritma, trigonometri, derajat-radian',
  usage: '<angka...>',
  run: async ({ command, args, prefix, reply }) => {
    const bad = (ex) => reply(`Format salah.\nContoh: ${prefix}${command} ${ex}`)

    if (command === 'prima') {
      const n = Number(args[0])
      if (!Number.isInteger(n) || n < 2 || n > 1e6) return bad('100   (batas atas 2 sampai 1.000.000)')
      const p = sieve(n)
      const shown = p.length > 60 ? `${p.slice(0, 40).join(', ')}, … , ${p.slice(-10).join(', ')}` : p.join(', ')
      return reply(panel('BILANGAN PRIMA', [{ head: `🔢 *PRIMA ≤ ${n.toLocaleString('id-ID')}*`, lines: [`Jumlah : ${p.length.toLocaleString('id-ID')}`, `Terbesar : ${p[p.length - 1]}`, `Daftar : ${shown}`], plain: true }]))
    }

    if (command === 'tabelkali') {
      const n = parseNum(args[0])
      const upto = args[1] === undefined ? 10 : Number(args[1])
      if (n === null || !Number.isInteger(upto) || upto < 1 || upto > 30) return bad('7   atau   12 20   (angka, [sampai berapa, maks 30])')
      return reply(panel(`TABEL PERKALIAN ${num(n, 4)}`, [{ head: '✖️ *HASIL*', lines: Array.from({ length: upto }, (_, i) => `${num(n, 4)} × ${i + 1} = ${f(n * (i + 1), 6)}`), plain: true }]))
    }

    if (command === 'akar') {
      const x = parseNum(args[0])
      const k = args[1] === undefined ? 2 : Number(args[1])
      if (x === null || !Number.isInteger(k) || k < 2 || k > 20 || (x < 0 && k % 2 === 0)) return bad('144   •   27 3   (angka, [akar ke-n])')
      const r = x < 0 ? -Math.pow(-x, 1 / k) : Math.pow(x, 1 / k)
      const lines = [`${k === 2 ? '√' : k === 3 ? '∛' : `${k}√`}${f(x, 6)} = *${f(r, 8)}*`]
      if (k === 2 && Number.isInteger(x) && x > 3 && x <= 1e12) {
        const s = simplifySqrt(x)
        if (s.out > 1 && s.rest > 1) lines.push(`Bentuk sederhana : ${s.out}√${s.rest}`)
        else if (s.rest === 1) lines.push('Akar sempurna ✅')
      }
      return reply(panel('AKAR', [{ head: '➗ *HASIL*', lines, plain: true }]))
    }

    if (command === 'pangkat') {
      const a = parseNum(args[0])
      const b = parseNum(args[1])
      if (a === null || b === null) return bad('2 10')
      if (Number.isInteger(a) && Number.isInteger(b) && b >= 0 && b <= 2000 && Math.abs(a) <= 1e6) {
        const s = (BigInt(a) ** BigInt(b)).toString()
        return reply(panel('PANGKAT', [{ head: '➗ *HASIL*', lines: [`${a}^${b} = *${s.length <= 40 ? BigInt(s).toLocaleString('id-ID') : `${s.slice(0, 1)},${s.slice(1, 8)} × 10^${s.length - 1}`}*`, s.length > 40 ? `(${s.length} digit)` : ''].filter(Boolean), plain: true }]))
      }
      const r = Math.pow(a, b)
      if (!Number.isFinite(r)) return reply('Hasil tidak terdefinisi atau terlalu besar.')
      return reply(panel('PANGKAT', [{ head: '➗ *HASIL*', lines: [`${f(a)}^${f(b)} = *${Math.abs(r) >= 1e21 || (r !== 0 && Math.abs(r) < 1e-6) ? r.toExponential(6) : f(r, 8)}*`], plain: true }]))
    }

    if (command === 'logaritma') {
      const x = parseNum(args[0])
      const bs = (args[1] || '10').toLowerCase()
      const base = bs === 'e' ? Math.E : parseNum(bs)
      if (x === null || !(x > 0) || base === null || !(base > 0) || base === 1) return bad('1000 10   •   8 2   •   20 e')
      return reply(panel('LOGARITMA', [{ head: '➗ *HASIL*', lines: [`${bs === 'e' ? 'ln' : `log basis ${f(base)}`} dari ${f(x)} = *${f(Math.log(x) / Math.log(base), 8)}*`], plain: true }]))
    }

    if (command === 'trigono') {
      const v = parseNum(args[0])
      const rad = args.slice(1).some((x) => /^rad/i.test(x))
      if (v === null || Math.abs(v) > 1e6) return bad('30   atau   1.5708 rad')
      const r = rad ? v : (v * Math.PI) / 180
      const deg = rad ? (v * 180) / Math.PI : v
      const s = Math.sin(r)
      const c = Math.cos(r)
      const near0 = Math.abs(c) < 1e-12
      const nearS0 = Math.abs(s) < 1e-12
      return reply(panel('TRIGONOMETRI', [{ head: `📐 *${f(deg, 6)}° = ${f(r, 6)} rad*`, lines: [`sin = *${f(s, 8)}*`, `cos = *${f(c, 8)}*`, `tan = *${near0 ? 'tak terdefinisi' : f(s / c, 8)}*`, `cot = ${nearS0 ? 'tak terdefinisi' : f(c / s, 8)}`, `sec = ${near0 ? 'tak terdefinisi' : f(1 / c, 8)}`, `csc = ${nearS0 ? 'tak terdefinisi' : f(1 / s, 8)}`], plain: true }]))
    }

    // derajat <nilai> [rad]
    const v = parseNum(args[0])
    if (v === null) return bad('180   (derajat → radian)   atau   3.14159 rad   (radian → derajat)')
    const fromRad = args.slice(1).some((x) => /^rad/i.test(x))
    return reply(panel('DERAJAT ↔ RADIAN', [{ head: '📐 *HASIL*', lines: [fromRad ? `${f(v)} rad = *${f((v * 180) / Math.PI, 8)}°*` : `${f(v)}° = *${f((v * Math.PI) / 180, 8)} rad*`, !fromRad && `Dalam π : ${f(v / 180, 6)}π`].filter(Boolean), plain: true }]))
  }
}
module.exports.sieve = sieve
module.exports.simplifySqrt = simplifySqrt
