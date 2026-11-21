const { getQuotedText } = require('../../lib/utils')
const M = { '!': '❗', '?': '❓', '0': '0️⃣', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣', '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣' }
const regional = (c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 97)
module.exports = {
  name: 'emojify', command: ['emojify', 'hurufemoji', 'bigtext'], category: 'fun', emoji: '🔤', desc: 'Ubah teks jadi huruf emoji besar', usage: '<teks>',
  run: async ({ msg, text, prefix, reply }) => {
    const s = (text || getQuotedText(msg) || '').toLowerCase().slice(0, 60)
    if (!s) return reply(`Contoh: ${prefix}emojify halo`)
    await reply([...s].map((c) => (/[a-z]/.test(c) ? `${regional(c)} ` : M[c] || (c === ' ' ? '   ' : c))).join('').trim())
  }
}
