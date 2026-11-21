// Gaya huruf unik (Unicode)
const range = (text, upper, lower, digit, exceptions = {}) =>
  [...text]
    .map((ch) => {
      if (exceptions[ch]) return exceptions[ch]
      const c = ch.codePointAt(0)
      if (c >= 65 && c <= 90 && upper) return String.fromCodePoint(upper + c - 65)
      if (c >= 97 && c <= 122 && lower) return String.fromCodePoint(lower + c - 97)
      if (c >= 48 && c <= 57 && digit) return String.fromCodePoint(digit + c - 48)
      return ch
    })
    .join('')

const SMALL = { a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 'ꜱ', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ' }

const STYLES = {
  'Bold': (t) => range(t, 0x1d400, 0x1d41a, 0x1d7ce),
  'Italic': (t) => range(t, 0x1d434, 0x1d44e, 0, { h: 'ℎ' }),
  'Bold Italic': (t) => range(t, 0x1d468, 0x1d482, 0x1d7ce),
  'Sans Bold': (t) => range(t, 0x1d5d4, 0x1d5ee, 0x1d7ec),
  'Monospace': (t) => range(t, 0x1d670, 0x1d68a, 0x1d7f6),
  'Circled': (t) => range(t, 0x24b6, 0x24d0, 0, { 0: '⓪' }).replace(/[1-9]/g, (d) => String.fromCodePoint(0x2460 + Number(d) - 1)),
  'Small Caps': (t) => [...t.toLowerCase()].map((c) => SMALL[c] || c).join('')
}

module.exports = {
  name: 'fancy',
  command: ['fancy', 'font', 'gayatulisan'],
  category: 'tools',
  desc: 'Ubah teks jadi berbagai gaya huruf',
  usage: '<teks>',
  run: async ({ text, prefix, reply }) => {
    if (!text) return reply(`Contoh: ${prefix}fancy vanXone`)
    if (text.length > 200) return reply('Teks maksimal 200 karakter.')
    await reply(`*GAYA TULISAN*\n\n${Object.entries(STYLES).map(([n, fn]) => `▬ *${n}*\n${fn(text)}`).join('\n\n')}`)
  }
}
