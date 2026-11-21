module.exports = {
  name: 'regex', command: ['regex', 'regextest'], category: 'tools', emoji: '🧩', desc: 'Uji regex terhadap teks: /pola/flag teks', usage: '/pola/flag <teks>',
  run: async ({ text, prefix, reply }) => {
    const m = text.match(/^\/(.+)\/([a-z]*)\s+([\s\S]+)$/)
    if (!m) return reply(`Format: ${prefix}regex /pola/flag teks\nContoh: ${prefix}regex /\\d+/g order 12 dan 345`)
    let re
    try { re = new RegExp(m[1], m[2].includes('g') ? m[2] : m[2] + 'g') } catch (e) { return reply(`❌ Regex tidak valid: ${e.message}`) }
    if (m[1].length > 200 || m[3].length > 2000) return reply('Pola/teks terlalu panjang.')
    const found = []
    let x, guard = 0
    while ((x = re.exec(m[3])) && guard++ < 50) { found.push(`${found.length + 1}. "${x[0]}" @${x.index}${x.length > 1 ? ` grup: ${x.slice(1).map((g) => `"${g}"`).join(', ')}` : ''}`); if (x[0] === '') re.lastIndex++ }
    await reply(`🧩 *REGEX TEST*\n\n▬ *Pola:* /${m[1]}/${m[2]}\n▬ *Cocok:* ${found.length}\n\n${found.join('\n') || '_Tidak ada yang cocok._'}`)
  }
}
