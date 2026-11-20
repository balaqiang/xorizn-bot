// Alat teks: huruf besar/kecil/judul, snake/camel/kebab, hitung kata, palindrom, urutkan/unik/acak/nomori baris
const { getQuotedText } = require('../../lib/utils')
const { panel, num } = require('../../lib/uitext')

const words = (s) => s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').split(/[^A-Za-z0-9]+/).filter(Boolean).map((w) => w.toLowerCase())
const title = (s) => s.toLowerCase().replace(/(^|[\s\-_(])(\p{L})/gu, (m, a, b) => a + b.toUpperCase())

const CMDS = {
  kapital: ['Huruf BESAR', (s) => s.toUpperCase()],
  kecil: ['huruf kecil', (s) => s.toLowerCase()],
  judul: ['Huruf Judul', title],
  snakecase: ['snake_case', (s) => words(s).join('_')],
  camelcase: ['camelCase', (s) => words(s).map((w, i) => (i ? w[0].toUpperCase() + w.slice(1) : w)).join('')],
  kebabcase: ['kebab-case', (s) => words(s).join('-')]
}
const LISTCMD = ['urutkan', 'unik', 'acakbaris', 'nomori']
const ALL = [...Object.keys(CMDS), 'hitungkata', 'wordcount', 'palindrom', ...LISTCMD]

module.exports = {
  name: 'textkit',
  command: ALL,
  category: 'tools',
  emoji: '🔤',
  desc: 'Alat teks: ubah huruf, hitung kata, palindrom, urutkan/unik/acak/nomori baris',
  usage: '<teks> (atau reply pesan)',
  run: async ({ msg, command, body, prefix, reply }) => {
    let text = String(body || '').replace(/^\S+[ \t]*/, '')
    const flagDesc = command === 'urutkan' && /^-z(\s|$)/.test(text)
    if (flagDesc) text = text.replace(/^-z[ \t]*/, '')
    if (!text.trim()) text = getQuotedText(msg) || ''
    if (!text.trim()) return reply(`Tulis teksnya atau reply pesan.\nContoh: ${prefix}${command} halo dunia${command === 'urutkan' ? `\n(urut terbalik: ${prefix}urutkan -z ...)` : ''}`)
    if (text.length > 5000) return reply('Teks terlalu panjang (maks 5000 karakter).')

    if (CMDS[command]) return reply(`*${CMDS[command][0]}*\n${CMDS[command][1](text)}`)

    if (command === 'hitungkata' || command === 'wordcount') {
      const w = text.trim().split(/\s+/).filter(Boolean)
      const longest = w.reduce((a, b) => (b.replace(/[^\p{L}\p{N}]/gu, '').length > a.replace(/[^\p{L}\p{N}]/gu, '').length ? b : a), '')
      return reply(
        panel('HITUNG KATA', [
          {
            head: '📊 *STATISTIK*',
            lines: [
              `Kata : ${num(w.length, 0)}`,
              `Karakter : ${num(text.length, 0)}`,
              `Karakter tanpa spasi : ${num(text.replace(/\s/g, '').length, 0)}`,
              `Kalimat : ${num((text.match(/[^.!?\n]+[.!?]+|[^.!?\n]+$/g) || []).filter((x) => x.trim()).length, 0)}`,
              `Baris : ${num(text.split(/\n/).length, 0)}`,
              `Paragraf : ${num(text.split(/\n\s*\n/).filter((x) => x.trim()).length, 0)}`,
              `Kata terpanjang : ${longest.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')}`,
              `Waktu baca : ±${Math.max(1, Math.round(w.length / 200 * 60))} detik`
            ]
          }
        ])
      )
    }

    if (command === 'palindrom') {
      const clean = text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')
      if (!clean) return reply('Tidak ada huruf/angka untuk diperiksa.')
      const rev = [...clean].reverse().join('')
      return reply(`${clean === rev ? '✅ *Palindrom!*' : '❌ *Bukan palindrom*'}\nTeks bersih : ${clean}\nDibalik : ${rev}`)
    }

    // ---- perintah berbasis baris (atau dipisah koma kalau cuma satu baris)
    const hasNL = /\n/.test(text)
    const sep = hasNL ? '\n' : ','
    const items = text.split(sep).map((x) => x.trim()).filter(Boolean)
    const join = (arr) => arr.join(hasNL ? '\n' : ', ')
    if (command === 'urutkan') {
      const sorted = [...items].sort((a, b) => a.localeCompare(b, 'id', { numeric: true, sensitivity: 'base' }))
      return reply(`*Urut ${flagDesc ? 'Z-A' : 'A-Z'}* (${items.length} item)\n${join(flagDesc ? sorted.reverse() : sorted)}`)
    }
    if (command === 'unik') {
      const seen = new Set()
      const out = items.filter((x) => !seen.has(x.toLowerCase()) && seen.add(x.toLowerCase()))
      return reply(`*Tanpa duplikat* (${items.length} → ${out.length} item)\n${join(out)}`)
    }
    if (command === 'acakbaris') {
      const a = [...items]
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
      }
      return reply(`*Diacak* (${a.length} item)\n${join(a)}`)
    }
    // nomori
    return reply(items.map((x, i) => `${i + 1}. ${x}`).join('\n'))
  }
}
module.exports.words = words
module.exports.title = title
