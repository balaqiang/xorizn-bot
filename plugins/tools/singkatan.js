// .singkatan — kepanjangan singkatan umum Indonesia
const { SINGKATAN } = require('../../lib/data/singkatan')
const { find } = require('../../lib/lookup')
const { panel } = require('../../lib/uitext')

module.exports = {
  name: 'singkatan',
  command: ['singkatan', 'kepanjangan'],
  category: 'tools',
  emoji: '🔠',
  desc: 'Kepanjangan singkatan umum (KTP, BPJS, UMKM, dst.)',
  usage: '<singkatan>',
  run: async ({ args, prefix, reply }) => {
    const q = args.join(' ').trim()
    if (!q) return reply(panel('SINGKATAN', [{ head: '📖 *CARA PAKAI*', lines: [`${prefix}singkatan KTP`, `${prefix}singkatan bpjs`, `${prefix}singkatan pajak  (cari di kepanjangan)`] }], { tip: `💡 ${SINGKATAN.length} singkatan tersedia.` }))
    const r = find(SINGKATAN, q, (x) => [x.s])
    if (r.exact) return reply(panel('SINGKATAN', [{ head: `🔠 *${r.exact.s}*`, lines: [r.exact.k], plain: true }]))
    if (r.partial.length) return reply(panel('SINGKATAN', [{ head: `🔎 *"${q}"* • ${r.partial.length} cocok`, lines: r.partial.slice(0, 15).map((x) => `${x.s} = ${x.k}`) }]))
    // cari di kepanjangan
    const byText = SINGKATAN.filter((x) => x.k.toLowerCase().includes(q.toLowerCase()))
    if (byText.length) return reply(panel('SINGKATAN', [{ head: `🔎 *"${q}"* • ${byText.length} cocok`, lines: byText.slice(0, 15).map((x) => `${x.s} = ${x.k}`) }]))
    await reply(`"${q}" tidak ada di data (${SINGKATAN.length} singkatan).`)
  }
}
