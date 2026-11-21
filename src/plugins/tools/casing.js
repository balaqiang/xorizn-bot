const { getQuotedText } = require('../../lib/utils')
const words = (s) => s.replace(/([a-z])([A-Z])/g, '$1 $2').split(/[\s_\-]+/).filter(Boolean)
const F = {
  upper: (s) => s.toUpperCase(), lower: (s) => s.toLowerCase(),
  title: (s) => s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase()),
  kalimat: (s) => s.toLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (_, a, b) => a + b.toUpperCase()),
  camel: (s) => words(s).map((w, i) => (i ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase())).join(''),
  snake: (s) => words(s).map((w) => w.toLowerCase()).join('_'),
  kebab: (s) => words(s).map((w) => w.toLowerCase()).join('-'),
  swap: (s) => [...s].map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join('')
}
module.exports = {
  name: 'casing', command: ['casing', 'hurufbesar', 'hurufkecil', 'titlecase'], category: 'tools', emoji: '🔡', desc: 'Ubah huruf: upper/lower/title/kalimat/camel/snake/kebab/swap', usage: '<mode> <teks>  (atau .hurufbesar teks)',
  run: async ({ msg, command, args, prefix, reply }) => {
    let mode = { hurufbesar: 'upper', hurufkecil: 'lower', titlecase: 'title' }[command]
    let rest = args
    if (!mode) { mode = (args[0] || '').toLowerCase(); rest = args.slice(1) }
    const s = (rest.join(' ') || getQuotedText(msg) || '').trim()
    if (!F[mode] || !s) return reply(`Mode: ${Object.keys(F).join(', ')}\nContoh: ${prefix}casing camel halo dunia indah\nAtau balas pesan: ${prefix}casing upper`)
    await reply(F[mode](s))
  }
}
