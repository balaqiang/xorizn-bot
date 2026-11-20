// .negara — info negara | .kodetelp — cari negara dari kode telepon
const { NEGARA } = require('../../lib/data/negara')
const { find } = require('../../lib/lookup')
const { panel } = require('../../lib/uitext')

const card = (n) =>
  panel('INFO NEGARA', [{ head: `🌍 *${n.id.toUpperCase()}*`, lines: [`Nama Inggris : ${n.en}`, `Ibukota : ${n.ibukota}`, `Mata uang : ${n.uang}`, `Kode telepon : +${n.kode}`, `Benua : ${n.benua}`] }])

module.exports = {
  name: 'negara',
  command: ['negara', 'kodetelp'],
  category: 'tools',
  emoji: '🌍',
  desc: 'Info negara (ibukota, mata uang, kode telepon) & cari dari kode telepon',
  usage: '<nama negara> | kodetelp <kode>',
  run: async ({ command, args, prefix, reply }) => {
    const q = args.join(' ').trim()

    if (command === 'kodetelp') {
      const code = q.replace(/^\+/, '').replace(/\D/g, '')
      if (!code) return reply(`Contoh: ${prefix}kodetelp 62  atau  ${prefix}kodetelp +81`)
      const hit = NEGARA.filter((n) => n.kode === code)
      if (!hit.length) return reply(`Kode +${code} tidak ada di data. Contoh: ${prefix}kodetelp 62`)
      return reply(panel('KODE TELEPON', [{ head: `📞 *+${code}*`, lines: hit.map((n) => `${n.id} (${n.ibukota})`) }]))
    }

    if (!q) {
      return reply(
        panel('INFO NEGARA', [{ head: '📖 *CARA PAKAI*', lines: [`${prefix}negara jepang`, `${prefix}negara germany  (nama Inggris juga bisa)`, `${prefix}negara asia  (daftar negara per benua)`] }], { tip: `💡 ${NEGARA.length} negara tersedia. Cari dari kode: ${prefix}kodetelp 62` })
      )
    }
    // daftar per benua
    const bn = NEGARA.filter((n) => n.benua.toLowerCase().replace(/\s/g, '') === q.toLowerCase().replace(/\s/g, ''))
    if (bn.length) return reply(panel(`NEGARA ${bn[0].benua.toUpperCase()}`, [{ head: `🌍 *${bn.length} NEGARA*`, lines: [bn.map((n) => n.id).join(', ')], plain: true }]))

    const r = find(NEGARA, q, (n) => [n.id, n.en])
    if (r.exact) return reply(card(r.exact))
    if (r.partial.length) return reply(`Maksud kamu:\n${r.partial.slice(0, 8).map((n) => `• ${n.id}`).join('\n')}`)
    await reply(`Negara "${q}" tidak ada di data (${NEGARA.length} negara). Coba nama lain atau ${prefix}negara asia.`)
  }
}
