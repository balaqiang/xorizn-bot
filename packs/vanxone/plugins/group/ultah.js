const ultah = require('../../lib/ultah')
const { userOf } = require('../../lib/utils')

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

module.exports = {
  name: 'ultah',
  command: ['ultah', 'ulangtahun', 'birthday'],
  category: 'group',
  desc: 'Daftar ulang tahun member grup yang akan datang',
  group: true,
  run: async ({ sock, msg, from, prefix, reply }) => {
    const meta = await sock.groupMetadata(from)
    const nums = meta.participants.map((p) => userOf(p.id))
    const rows = ultah.upcoming(nums, 10)
    if (!rows.length) return reply(`Belum ada member yang menyimpan ulang tahun.\nSimpan milikmu: ${prefix}setultah 17-08`)
    const text = [
      '🎂 *ULANG TAHUN TERDEKAT*',
      '',
      ...rows.map((r) => {
        const age = r.y ? ` • ${new Date(Date.now() + r.left * 86400000).getFullYear() - r.y} th` : ''
        return `${r.left === 0 ? '🎉' : '•'} @${r.n} — ${r.d} ${BULAN[r.m - 1]}${age} ${r.left === 0 ? '*HARI INI!*' : `(${r.left} hari lagi)`}`
      })
    ].join('\n')
    await sock.sendMessage(from, { text, mentions: rows.map((r) => `${r.n}@s.whatsapp.net`) }, { quoted: msg })
  }
}
