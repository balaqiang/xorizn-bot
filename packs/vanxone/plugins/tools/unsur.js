// .unsur — tabel periodik 118 unsur (cari lewat simbol, nama, atau nomor atom)
const { UNSUR, GOLONGAN } = require('../../lib/data/unsur')
const { find } = require('../../lib/lookup')
const { panel } = require('../../lib/uitext')

const card = (u) =>
  panel('UNSUR KIMIA', [{ head: `⚗️ *${u.nama.toUpperCase()}* (${u.simbol})`, lines: [`Nomor atom : ${u.no}`, `Simbol : ${u.simbol}`, `Massa atom relatif : ${String(u.ar).replace('.', ',')}`, `Golongan : ${GOLONGAN(u.no)}`] }], {
    tip: String(u.ar).startsWith('[') ? '💡 Angka dalam [ ] = nomor massa isotop paling stabil (unsur radioaktif).' : undefined
  })

module.exports = {
  name: 'unsur',
  command: ['unsur', 'tabelperiodik'],
  category: 'tools',
  emoji: '⚗️',
  desc: 'Tabel periodik: cari unsur dari simbol, nama, atau nomor atom',
  usage: '<simbol | nama | nomor>',
  run: async ({ args, prefix, reply }) => {
    const q = args.join(' ').trim()
    if (!q) {
      const rows = []
      for (let i = 0; i < UNSUR.length; i += 10) rows.push(UNSUR.slice(i, i + 10).map((u) => `${u.no}${u.simbol}`).join(' '))
      return reply(panel('TABEL PERIODIK', [{ head: '⚗️ *118 UNSUR (nomor + simbol)*', lines: rows, plain: true }], { tip: `💡 Detail: ${prefix}unsur Fe  •  ${prefix}unsur emas  •  ${prefix}unsur 79` }))
    }
    if (/^\d{1,3}$/.test(q)) {
      const u = UNSUR[Number(q) - 1]
      return u ? reply(card(u)) : reply('Nomor atom harus 1 sampai 118.')
    }
    // simbol persis (huruf besar/kecil diabaikan) diprioritaskan agar "Co" tidak jadi "Cobalt/Copper"
    const sym = UNSUR.find((u) => u.simbol.toLowerCase() === q.toLowerCase())
    if (sym) return reply(card(sym))
    const r = find(UNSUR, q, (u) => [u.nama, u.simbol])
    if (r.exact) return reply(card(r.exact))
    if (r.partial.length) return reply(`Maksud kamu:\n${r.partial.slice(0, 8).map((u) => `• ${u.nama} (${u.simbol}, ${u.no})`).join('\n')}`)
    await reply(`Unsur "${q}" tidak ditemukan. Coba simbol (Fe), nama (besi), atau nomor atom (26).`)
  }
}
