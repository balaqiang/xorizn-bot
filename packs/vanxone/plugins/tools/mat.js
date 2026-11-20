const MAXN = 1e12

function factorize(n) {
  const f = []
  for (let p = 2; p * p <= n; p += p === 2 ? 1 : 2) while (n % p === 0) { f.push(p); n /= p }
  if (n > 1) f.push(n)
  return f
}
const gcd = (a, b) => (b ? gcd(b, a % b) : a)
const isPrime = (n) => n > 1 && factorize(n).length === 1
const group = (f) => Object.entries(f.reduce((o, p) => ((o[p] = (o[p] || 0) + 1), o), {})).map(([p, e]) => (e > 1 ? `${p}^${e}` : p)).join(' × ')

module.exports = {
  factorize, gcd, isPrime,
  name: 'mat',
  command: ['mat', 'math2', 'hitungmat'],
  category: 'tools',
  desc: 'Alat matematika: prima, faktor, fpb, kpk, faktorial, persen',
  usage: 'prima|faktor|fpb|kpk|faktorial|persen ...',
  run: async ({ args, prefix, reply }) => {
    const sub = (args[0] || '').toLowerCase()
    const nums = args.slice(1).map((a) => Number(String(a).replace(/[.,]/g, '')))
    const help = `*ALAT MATEMATIKA*\n\n${prefix}mat prima 97\n${prefix}mat faktor 360\n${prefix}mat fpb 12 18\n${prefix}mat kpk 4 6 10\n${prefix}mat faktorial 10\n${prefix}mat persen 20 150  (20% dari 150)\n${prefix}mat persen 30 120 naik|turun`
    const intOk = (n) => Number.isInteger(n) && n >= 1 && n <= MAXN

    if (sub === 'prima') {
      if (!intOk(nums[0])) return reply(`Masukkan bilangan bulat 1 - ${MAXN.toExponential(0)}.`)
      return reply(isPrime(nums[0]) ? `✅ ${nums[0]} adalah bilangan prima.` : `❌ ${nums[0]} bukan bilangan prima.\nFaktor: ${group(factorize(nums[0]))}`)
    }
    if (sub === 'faktor') {
      if (!intOk(nums[0]) || nums[0] < 2) return reply('Masukkan bilangan bulat ≥ 2.')
      return reply(`🔢 Faktorisasi prima ${nums[0]}:\n${nums[0]} = ${group(factorize(nums[0]))}`)
    }
    if (sub === 'fpb' || sub === 'kpk') {
      const list = nums.filter(Boolean)
      if (list.length < 2 || list.length > 8 || !list.every(intOk)) return reply(`Masukkan 2-8 bilangan bulat positif.\nContoh: ${prefix}mat ${sub} 12 18`)
      const g = list.reduce(gcd)
      const l = list.reduce((a, b) => (a / gcd(a, b)) * b)
      if (!Number.isSafeInteger(l)) return reply('Hasil KPK terlalu besar.')
      return reply(sub === 'fpb' ? `FPB dari ${list.join(', ')} = *${g}*` : `KPK dari ${list.join(', ')} = *${l}*`)
    }
    if (sub === 'faktorial') {
      const n = nums[0]
      if (!Number.isInteger(n) || n < 0 || n > 170) return reply('Masukkan bilangan bulat 0 - 170.')
      let r = 1n
      for (let i = 2n; i <= BigInt(n); i++) r *= i
      const s = r.toString()
      return reply(`${n}! = ${s.length > 60 ? `${s[0]},${s.slice(1, 8)}×10^${s.length - 1} (${s.length} digit)` : s}`)
    }
    if (sub === 'persen') {
      const [a, b] = nums
      if (![a, b].every(Number.isFinite)) return reply(help)
      const mode = (args[3] || '').toLowerCase()
      if (mode === 'naik') return reply(`${b} naik ${a}% = *${+(b * (1 + a / 100)).toFixed(4)}*`)
      if (mode === 'turun') return reply(`${b} turun ${a}% = *${+(b * (1 - a / 100)).toFixed(4)}*`)
      return reply(`${a}% dari ${b} = *${+((a / 100) * b).toFixed(4)}*\n${a} adalah ${b ? +((a / b) * 100).toFixed(2) : '∞'}% dari ${b}`)
    }
    await reply(help)
  }
}
