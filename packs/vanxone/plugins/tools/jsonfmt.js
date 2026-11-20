const { getQuotedText } = require('../../lib/utils')
module.exports = {
  name: 'jsonfmt', command: ['json', 'jsonfmt', 'jsonmin'], category: 'tools', emoji: '🧾', desc: 'Rapikan / kecilkan JSON & cek validitas', usage: '<json> (atau balas pesan)',
  run: async ({ msg, command, text, prefix, reply }) => {
    const s = (text || getQuotedText(msg) || '').trim()
    if (!s) return reply(`Kirim JSON-nya.\nContoh: ${prefix}json {"a":1,"b":[1,2]}\nMinify: ${prefix}jsonmin {...}`)
    try {
      const o = JSON.parse(s)
      const out = command === 'jsonmin' ? JSON.stringify(o) : JSON.stringify(o, null, 2)
      await reply(`✅ *JSON valid*\n\n\`\`\`${out.slice(0, 3500)}\`\`\``)
    } catch (e) { await reply(`❌ JSON tidak valid:\n${e.message}`) }
  }
}
