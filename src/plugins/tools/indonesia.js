// .provinsi — data 38 provinsi | .platnomor — kode plat kendaraan
const { PROVINSI, PLAT } = require('../../lib/data/indonesia')
const { find, norm } = require('../../lib/lookup')
const { panel } = require('../../lib/uitext')

module.exports = {
  name: 'indonesia',
  command: ['provinsi', 'platnomor'],
  category: 'tools',
  emoji: '🇮🇩',
  desc: 'Info provinsi (ibukota & wilayah) dan kode plat nomor kendaraan',
  usage: '<nama provinsi/ibukota> | platnomor <kode>',
  run: async ({ command, args, prefix, reply }) => {
    const q = args.join(' ').trim()

    if (command === 'provinsi') {
      if (!q) {
        const regions = [...new Set(PROVINSI.map((p) => p.wilayah))]
        return reply(
          panel('PROVINSI INDONESIA', regions.map((w) => ({ head: `🗺️ *${w.toUpperCase()}*`, lines: PROVINSI.filter((p) => p.wilayah === w).map((p) => `${p.nama} — ${p.ibukota}`) })), {
            tip: `💡 Total ${PROVINSI.length} provinsi. Detail: ${prefix}provinsi <nama atau ibukota>`
          })
        )
      }
      const r = find(PROVINSI, q, (p) => [p.nama, p.ibukota])
      const p = r.exact
      if (!p && !r.partial.length) return reply(`Provinsi "${q}" tidak ditemukan. Ketik ${prefix}provinsi untuk melihat daftar lengkap.`)
      if (!p) return reply(`Maksud kamu:\n${r.partial.slice(0, 8).map((x) => `• ${x.nama} (${x.ibukota})`).join('\n')}`)
      const nomor = PROVINSI.indexOf(p) + 1
      return reply(panel('DATA PROVINSI', [{ head: `🇮🇩 *${p.nama.toUpperCase()}*`, lines: [`Ibukota : ${p.ibukota}`, `Wilayah : ${p.wilayah}`, `Daftar ke : ${nomor} dari ${PROVINSI.length}`] }]))
    }

    // platnomor
    if (!q) {
      return reply(panel('KODE PLAT NOMOR', [{ head: '📖 *CARA PAKAI*', lines: [`${prefix}platnomor B  → wilayah plat B`, `${prefix}platnomor DK  → Bali`, `${prefix}platnomor jawa timur  → semua kode Jawa Timur`] }], { tip: `💡 ${PLAT.length} kode tersedia. Wilayah bisa berubah karena pemekaran.` }))
    }
    const k = norm(q)
    const byCode = PLAT.find((x) => norm(x.kode) === k)
    if (byCode) return reply(panel('KODE PLAT NOMOR', [{ head: `🚗 *PLAT ${byCode.kode}*`, lines: [byCode.wilayah], plain: true }]))
    const byRegion = PLAT.filter((x) => norm(x.wilayah).includes(k))
    if (!byRegion.length) return reply(`"${q}" tidak ditemukan. Contoh: ${prefix}platnomor B  atau  ${prefix}platnomor bali`)
    await reply(panel('KODE PLAT NOMOR', [{ head: `🚗 *"${q.toUpperCase()}"* • ${byRegion.length} kode`, lines: byRegion.slice(0, 25).map((x) => `${x.kode} — ${x.wilayah}`) }]))
  }
}
