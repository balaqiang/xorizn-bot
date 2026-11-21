// Pengubah gaya teks lucu: uwu, alay, terbalik huruf besar-kecil, spasi, gema
const { getQuotedText } = require('../../lib/utils')
const ALAY = { a: '4', i: '1', e: '3', o: '0', s: '5', g: '9', t: '7', b: '8' }
const T = {
  uwu: (s) => s.replace(/[rl]/g, 'w').replace(/[RL]/g, 'W').replace(/n([aeiou])/g, 'ny$1') + ' uwu~ 🥺',
  alay: (s) => [...s].map((c, i) => (ALAY[c.toLowerCase()] && i % 2 ? ALAY[c.toLowerCase()] : i % 2 ? c.toUpperCase() : c.toLowerCase())).join(''),
  spasi: (s) => [...s].join(' '),
  gema: (s) => `${s}... ${s.slice(-Math.ceil(s.length / 2))}... ${s.slice(-Math.ceil(s.length / 4))}...`,
  ngegas: (s) => `${s.toUpperCase()}!!! ${'🔥'.repeat(3)}`,
  lirih: (s) => `${s.toLowerCase()}... 🥀`,
  mocking: (s) => [...s].map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join('')
}
module.exports = {
  name: 'textstyle', command: ['uwu', 'gema', 'ngegas', 'lirih', 'mocking'], category: 'fun', emoji: '✍️', desc: 'Ubah teks jadi gaya uwu, alay, spasi, gema, ngegas, lirih', usage: '<teks> (atau balas pesan)',
  run: async ({ msg, command, text, prefix, reply }) => {
    const s = (text || getQuotedText(msg) || '').trim()
    if (!s) return reply(`Masukkan teks atau balas pesan.\nContoh: ${prefix}${command} aku lapar banget`)
    if (s.length > 500) return reply('Teks terlalu panjang (maks 500 karakter).')
    await reply(T[command](s))
  }
}
