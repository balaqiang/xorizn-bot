// .rumus — kumpulan rumus matematika, fisika, kimia
const { RUMUS } = require('../../lib/data/rumus')
const { find } = require('../../lib/lookup')
const { panel } = require('../../lib/uitext')

module.exports = {
  name: 'rumus',
  command: ['rumus', 'formula'],
  category: 'tools',
  emoji: '📐',
  desc: 'Kumpulan rumus matematika, fisika, dan kimia',
  usage: '[nama rumus | kategori]',
  run: async ({ args, prefix, reply }) => {
    const q = args.join(' ').trim()
    const cats = [...new Set(RUMUS.map((r) => r.kategori))]
    if (!q) {
      return reply(panel('KUMPULAN RUMUS', cats.map((c) => ({ head: `📐 *${c.toUpperCase()}*`, lines: [RUMUS.filter((r) => r.kategori === c).map((r) => r.k).join(', ')], plain: true })), { tip: `💡 ${RUMUS.length} rumus. Contoh: ${prefix}rumus lingkaran  •  ${prefix}rumus fisika` }))
    }
    const cat = cats.find((c) => c.toLowerCase().replace(/\s/g, '') === q.toLowerCase().replace(/\s/g, ''))
    if (cat) return reply(panel(cat.toUpperCase(), [{ head: `📐 *${RUMUS.filter((r) => r.kategori === cat).length} RUMUS*`, lines: RUMUS.filter((r) => r.kategori === cat).map((r) => `${r.k} — ${r.nama}`) }], { tip: `💡 Detail: ${prefix}rumus <nama>` }))
    const r = find(RUMUS, q, (x) => [x.k, x.nama])
    if (r.exact) {
      const x = r.exact
      return reply(panel('RUMUS', [{ head: `📐 *${x.nama.toUpperCase()}*`, lines: x.rumus, plain: true }, { head: '📝 *KETERANGAN*', lines: [x.ket, `Kategori : ${x.kategori}`], plain: true }]))
    }
    if (r.partial.length) return reply(`Maksud kamu:\n${r.partial.slice(0, 8).map((x) => `• ${x.k} (${x.nama})`).join('\n')}`)
    await reply(`Rumus "${q}" tidak ditemukan. Ketik ${prefix}rumus untuk daftar lengkap.`)
  }
}
