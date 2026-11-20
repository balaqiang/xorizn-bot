// .tema — ganti tema tampilan: warna kartu rich dan mode warna
const theme = require('../../lib/theme')
const uimode = require('../../lib/uimode')
const { panel } = require('../../lib/uitext')

module.exports = {
  name: 'tema',
  command: ['tema', 'theme', 'gayatampilan'],
  category: 'info',
  emoji: '🎨',
  desc: 'Lihat & ganti tema tampilan bot (rich)',
  usage: 'rich <nama> | warna <tema|kategori>',
  run: async ({ args, prefix, reply, isOwner }) => {
    const sub = (args[0] || '').toLowerCase()
    const val = args[1]
    const richList = Object.entries(theme.RICH).map(([id, t]) => `${t.emoji} ${id} — ${t.name}${id === theme.richId() ? '  ✅ aktif' : ''}`)

    if (!sub) {
      return reply(
        panel('TEMA TAMPILAN', [
          { head: '🎛️ *MODE SAAT INI*', lines: [`Tampilan: ${uimode.get().toUpperCase()}`, `Warna kartu: ${theme.unify() ? 'ikut tema' : 'per kategori'}`] },
          { head: '🌈 *TEMA RICH (kartu HTML)*', lines: richList, plain: true },
          { head: '📖 *CARA PAKAI*', lines: [`${prefix}tema rich sunset`, `${prefix}tema warna tema  (semua kartu satu warna)`, `${prefix}tema warna kategori  (warna beda tiap kategori)`, `${prefix}tema reset`] }
        ])
      )
    }
    if (!isOwner) return reply('Hanya owner yang boleh mengganti tema. Kamu tetap bisa melihat daftar dengan ' + prefix + 'tema')

    if (sub === 'reset') {
      theme.setRich('aurora'); theme.setUnify(false)
      return reply(panel('TEMA DIRESET', [{ head: '✅ *SELESAI*', lines: ['Rich: Aurora', 'Warna: per kategori'] }]))
    }
    if (sub === 'warna') {
      const v = String(val || '').toLowerCase()
      if (!['tema', 'kategori'].includes(v)) return reply(`Pilih: ${prefix}tema warna tema  atau  ${prefix}tema warna kategori`)
      theme.setUnify(v === 'tema')
      return reply(panel('WARNA KARTU', [{ head: '✅ *DIUBAH*', lines: [v === 'tema' ? 'Semua kartu rich memakai warna tema' : 'Warna kartu mengikuti kategori fitur'] }, { head: '💡 *LANGKAH*', lines: [`Ketik ${prefix}menu untuk melihat hasilnya`] }]))
    }
    if (sub === 'rich') {
      const id = theme.setRich(val)
      if (!id) return reply(`Nama tidak dikenal "${val || ''}". Ketik ${prefix}tema untuk daftar.`)
      const label = `${theme.RICH[id].emoji} ${theme.RICH[id].name}`
      const hint = uimode.get() !== 'rich' ? `Tema rich tampil saat ${prefix}uimode rich` : `Ketik ${prefix}menu untuk melihat hasilnya`
      return reply(panel('TEMA DIUBAH', [{ head: '✅ *AKTIF*', lines: [label] }, { head: '💡 *LANGKAH*', lines: [hint, 'Berlaku langsung, tanpa restart'] }]))
    }
    return reply(`Perintah tidak dikenal. Ketik ${prefix}tema untuk bantuan.`)
  }
}
