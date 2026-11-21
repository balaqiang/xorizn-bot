// Pengubah teks: hex, rot13, caesar, URL encode/decode
const { getQuotedText } = require('../../lib/utils')

const rot = (s, k) =>
  s.replace(/[a-z]/gi, (c) => {
    const base = c <= 'Z' ? 65 : 97
    return String.fromCharCode(((((c.charCodeAt(0) - base + k) % 26) + 26) % 26) + base)
  })

module.exports = {
  name: 'encoders',
  command: ['hex', 'unhex', 'rot13', 'caesar', 'urlencode', 'urldecode'],
  category: 'tools',
  emoji: '🔐',
  desc: 'Ubah teks: hex, rot13, caesar cipher, URL encode/decode',
  usage: '<teks> | caesar <geser> <teks>',
  run: async ({ msg, command, body, prefix, reply }) => {
    let text = String(body || '').replace(/^\S+[ \t]*/, '')
    let shift = 0
    if (command === 'caesar') {
      const m = text.match(/^(-?\d+)\s+([\s\S]+)$/)
      if (!m) return reply(`Format: ${prefix}caesar <geser> <teks>\nContoh: ${prefix}caesar 3 halo dunia\nMembuka sandi: ${prefix}caesar -3 krod gxqld`)
      shift = Number(m[1])
      text = m[2]
    }
    if (!text.trim()) text = getQuotedText(msg) || ''
    if (!text.trim()) return reply(`Tulis teksnya atau reply pesan.\nContoh: ${prefix}${command} halo`)
    if (text.length > 4000) return reply('Teks terlalu panjang (maks 4000 karakter).')

    try {
      if (command === 'hex') return reply(Buffer.from(text, 'utf8').toString('hex'))
      if (command === 'unhex') {
        const h = text.replace(/0x/gi, '').replace(/[\s,:-]/g, '')
        if (!/^[0-9a-f]+$/i.test(h) || h.length % 2) return reply('Bukan hex yang valid (harus pasangan 2 digit, 0-9 a-f).')
        return reply(Buffer.from(h, 'hex').toString('utf8'))
      }
      if (command === 'rot13') return reply(rot(text, 13))
      if (command === 'caesar') return reply(rot(text, shift))
      if (command === 'urlencode') return reply(encodeURIComponent(text))
      return reply(decodeURIComponent(text.replace(/\+/g, ' ')))
    } catch {
      await reply('Gagal memproses teks (format tidak valid).')
    }
  }
}
module.exports.rot = rot
