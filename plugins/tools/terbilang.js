// .terbilang — angka jadi kata (Indonesia) + .roman — angka <-> romawi
const { panel, parseMoney } = require('../../lib/uitext')

const S = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan']
const UNIT = ['', 'ribu', 'juta', 'miliar', 'triliun', 'kuadriliun']

function tiga(n) {
  const h = Math.floor(n / 100)
  const r = n % 100
  const out = []
  if (h) out.push(h === 1 ? 'seratus' : `${S[h]} ratus`)
  if (r) {
    if (r < 10) out.push(S[r])
    else if (r === 10) out.push('sepuluh')
    else if (r === 11) out.push('sebelas')
    else if (r < 20) out.push(`${S[r - 10]} belas`)
    else out.push(`${S[Math.floor(r / 10)]} puluh${r % 10 ? ` ${S[r % 10]}` : ''}`)
  }
  return out.join(' ')
}

// bilangan bulat (string digit, maks 18 digit) -> kata
function terbilang(digits) {
  let n = BigInt(digits)
  if (n === 0n) return 'nol'
  const groups = []
  while (n > 0n) {
    groups.push(Number(n % 1000n))
    n /= 1000n
  }
  const out = []
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i]
    if (!g) continue
    out.push(i === 1 && g === 1 ? 'seribu' : `${tiga(g)}${UNIT[i] ? ` ${UNIT[i]}` : ''}`)
  }
  return out.join(' ')
}

// "1.500.000", "12,5", "2,5jt" -> { int: '1500000', frac: '' | '5' }
function parseInput(raw) {
  const s = String(raw || '').trim().toLowerCase().replace(/^rp\.?\s*/, '')
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s) || /^\d+(,\d+)?$/.test(s) || /^\d+\.\d+$/.test(s)) {
    const clean = /^\d{1,3}(\.\d{3})+/.test(s) ? s.replace(/\./g, '') : s
    const [i, f = ''] = clean.replace(',', '.').split('.')
    return { int: i, frac: f }
  }
  const v = parseMoney(s)
  if (v === null) return null
  return { int: String(Math.round(v)), frac: '' }
}

module.exports = {
  name: 'terbilang',
  command: ['terbilang', 'angkakata'],
  category: 'tools',
  emoji: '🔢',
  desc: 'Ubah angka menjadi tulisan kata (terbilang)',
  usage: '<angka>',
  run: async ({ args, prefix, reply }) => {
    const p = parseInput(args.join(''))
    if (!p || p.int.length > 18) return reply(`Masukkan angka (maks 18 digit).\nContoh: ${prefix}terbilang 1.500.000\nContoh: ${prefix}terbilang 2,5jt\nContoh: ${prefix}terbilang 12,5`)
    const kata = terbilang(p.int) + (p.frac ? ` koma ${[...p.frac].map((d) => S[d]).join(' ')}` : '')
    const rupiah = p.frac ? null : `${kata} rupiah`
    await reply(panel('TERBILANG', [{ head: '🔢 *HASIL*', lines: [`Angka : ${BigInt(p.int).toLocaleString('id-ID')}${p.frac ? `,${p.frac}` : ''}`, `Terbilang : ${kata}`, rupiah && `Rupiah : ${rupiah}`].filter(Boolean) }]))
  }
}
module.exports.terbilang = terbilang
