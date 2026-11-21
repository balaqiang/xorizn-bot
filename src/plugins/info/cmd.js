// .cmd <perintah>  → detail perintah | .carifitur <kata> → cari perintah
const ui = require('../../lib/ui')
const { catIcon } = require('../../lib/menuicons')
const { panel } = require('../../lib/uitext')

const names = (p) => [].concat(p.command).map(String)

function score(p, q) {
  const n = names(p).map((x) => x.toLowerCase())
  const desc = String(p.desc || '').toLowerCase()
  let s = 0
  if (n.includes(q)) s += 100
  else if (n.some((x) => x.startsWith(q))) s += 60
  else if (n.some((x) => x.includes(q))) s += 40
  if (desc.includes(q)) s += 20
  if (String(p.category || '').toLowerCase() === q) s += 10
  return s
}

module.exports = {
  name: 'cmd',
  command: ['cmd', 'cekcmd', 'carifitur', 'caricmd'],
  category: 'info',
  emoji: '🔎',
  desc: 'Lihat detail perintah atau cari perintah',
  usage: '<perintah>  |  carifitur <kata>',
  run: async ({ command, args, plugins, prefix, isOwner, reply }) => {
    const visible = plugins.filter((p) => !p.owner || isOwner)
    const searching = command === 'carifitur' || command === 'caricmd'
    const q = args.join(' ').toLowerCase().replace(new RegExp(`^\\${prefix}`), '').trim()

    if (!q) {
      return reply(
        panel('CARI PERINTAH', [{ head: '📖 *CARA PAKAI*', lines: [`${prefix}cmd <perintah> → detail & cara pakai`, `${prefix}carifitur <kata> → cari perintah`, `Contoh: ${prefix}cmd play`, `Contoh: ${prefix}carifitur sticker`] }])
      )
    }

    // ---- pencarian
    const search = () =>
      visible
        .map((p) => [p, score(p, q)])
        .filter(([, s]) => s > 0)
        .sort((a, b) => b[1] - a[1] || names(a[0])[0].localeCompare(names(b[0])[0]))
        .map(([p]) => p)

    if (searching) {
      const found = search()
      if (!found.length) return reply(`Tidak ada perintah yang cocok dengan "${q}". Coba kata lain, atau lihat ${prefix}allmenu.`)
      const shown = found.slice(0, 15)
      return reply(
        panel(
          'HASIL PENCARIAN',
          [
            {
              head: `🔎 *"${q}"* • ${found.length} cocok`,
              lines: shown.map((p) => `${prefix}${names(p)[0]}${p.desc ? ` — ${p.desc}` : ''}`)
            }
          ],
          { tip: `💡 Detail lengkap: ${prefix}cmd <perintah>${found.length > shown.length ? `  (${found.length - shown.length} lainnya tidak ditampilkan)` : ''}` }
        )
      )
    }

    // ---- detail satu perintah
    const word = q.split(/\s+/)[0]
    const p = visible.find((x) => names(x).some((n) => n.toLowerCase() === word))
    if (!p) {
      const sim = search().slice(0, 5)
      return reply(
        `Perintah "${word}" tidak ditemukan.` +
          (sim.length ? `\n\nMungkin maksud kamu:\n${sim.map((x) => `• ${prefix}${names(x)[0]}`).join('\n')}` : `\n\nCoba ${prefix}carifitur <kata>.`)
      )
    }
    const [main, ...alias] = names(p)
    const cat = p.category || 'lainnya'
    const syarat = [p.owner && 'Khusus owner', (p.group || p.admin || p.botAdmin) && 'Hanya di grup', p.admin && 'Harus admin grup', p.botAdmin && 'Bot harus jadi admin'].filter(Boolean)
    await reply(
      panel(
        'DETAIL PERINTAH',
        [
          {
            head: `${p.emoji || catIcon(cat)} *${prefix}${main.toUpperCase()}*`,
            lines: [`Kategori : ${catIcon(cat)} ${ui.labelOf(cat)}`, p.desc && `Fungsi : ${p.desc}`, alias.length && `Alias : ${alias.map((a) => prefix + a).join(', ')}`, `Pakai : ${prefix}${main}${p.usage ? ` ${p.usage}` : ''}`, syarat.length && `Syarat : ${syarat.join(' • ')}`].filter(Boolean)
          }
        ],
        { tip: `💡 Lihat kategori: ${prefix}menu ${cat}` }
      )
    )
  }
}
