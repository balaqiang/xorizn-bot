const ultah = require('../../lib/ultah')

module.exports = {
  name: 'setultah',
  command: ['setultah', 'ultahku'],
  category: 'group',
  desc: 'Simpan tanggal ulang tahunmu (hapus: .setultah hapus)',
  usage: '<tgl-bln[-tahun]> | hapus',
  run: async ({ sender, args, prefix, reply }) => {
    const raw = args.join(' ').trim().toLowerCase()
    if (['hapus', 'reset'].includes(raw)) return reply(ultah.remove(sender) ? 'Tanggal ulang tahunmu dihapus.' : 'Kamu belum menyimpan tanggal ulang tahun.')
    const m = raw.match(/^(\d{1,2})[-/. ](\d{1,2})(?:[-/. ](\d{4}))?$/)
    const d = m && Number(m[1])
    const mo = m && Number(m[2])
    const y = m && m[3] ? Number(m[3]) : undefined
    const probe = m && new Date(Date.UTC(2000, mo - 1, d))
    if (!m || probe.getUTCMonth() !== mo - 1 || probe.getUTCDate() !== d) return reply(`Format: ${prefix}setultah <tgl-bln>\nContoh: ${prefix}setultah 17-08`)
    ultah.set(sender, d, mo, y)
    await reply(`🎂 Tersimpan: ${d}/${mo}. Teman grup bisa melihatnya lewat ${prefix}ultah`)
  }
}
