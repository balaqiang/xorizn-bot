// .totalfitur — hitung dari registry plugin bot yang sebenarnya (bukan dari global.plugins milik adapter engine yang kosong).
module.exports = {
  name: 'totalfitur',
  command: ['totalfitur', 'totalcmd', 'totalcommand', 'totalfeature'],
  category: 'info',
  emoji: '🧮',
  desc: 'Total fitur dan command bot',
  usage: '',
  run: async ({ plugins, reply }) => {
    const list = [...new Set(plugins || [])]
    const cmds = new Set()
    const cats = {}
    for (const p of list) {
      const c = [].concat(p.command || []).map((x) => String(x).toLowerCase())
      c.forEach((x) => cmds.add(x))
      const cat = p.category || 'lainnya'
      cats[cat] = (cats[cat] || 0) + 1
    }
    const top = Object.entries(cats).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, v]) => `▬ ${k}: ${v}`).join('\n')
    await reply(`🧮 *TOTAL FITUR*\n\n▬ *Total fitur:* ${list.length}\n▬ *Total command:* ${cmds.size}\n▬ *Kategori:* ${Object.keys(cats).length}\n\n${top}`)
  }
}
