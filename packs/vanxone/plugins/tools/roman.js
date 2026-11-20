// .roman — angka <-> angka Romawi
const { panel } = require('../../lib/uitext')

const ROMAN = [['M', 1000], ['CM', 900], ['D', 500], ['CD', 400], ['C', 100], ['XC', 90], ['L', 50], ['XL', 40], ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]]
const toRoman = (n) => ROMAN.reduce((s, [r, v]) => { while (n >= v) { s += r; n -= v } return s }, '')
function fromRoman(s) {
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  let n = 0
  for (let i = 0; i < s.length; i++) {
    const v = map[s[i]]
    n += v < (map[s[i + 1]] || 0) ? -v : v
  }
  return toRoman(n) === s ? n : null // validasi bolak-balik (tolak "IIII", "VX", dst.)
}

module.exports = {
  name: 'roman',
  command: ['roman', 'romawi'],
  category: 'tools',
  emoji: '🏛️',
  desc: 'Ubah angka ke angka Romawi dan sebaliknya',
  usage: '<angka 1-3999 | romawi>',
  run: async ({ args, prefix, reply }) => {
    const a = (args[0] || '').trim()
    if (/^\d+$/.test(a)) {
      const n = Number(a)
      if (n < 1 || n > 3999) return reply('Angka Romawi baku hanya untuk 1 sampai 3999.')
      return reply(panel('ANGKA ROMAWI', [{ head: '🏛️ *HASIL*', lines: [`${n} = ${toRoman(n)}`] }]))
    }
    if (/^[ivxlcdm]+$/i.test(a)) {
      const n = fromRoman(a.toUpperCase())
      if (n === null) return reply(`"${a.toUpperCase()}" bukan angka Romawi yang valid.`)
      return reply(panel('ANGKA ROMAWI', [{ head: '🏛️ *HASIL*', lines: [`${a.toUpperCase()} = ${n}`] }]))
    }
    await reply(`Contoh: ${prefix}roman 2026  atau  ${prefix}roman MMXXVI`)
  }
}
module.exports.toRoman = toRoman
module.exports.fromRoman = fromRoman
