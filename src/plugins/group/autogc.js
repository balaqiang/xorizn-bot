// .autogc — jadwal buka-tutup grup otomatis setiap hari (WIB)
const gg = require('../../lib/groupguard')
const { panel } = require('../../lib/uitext')

const parseTime = (raw) => {
  const m = String(raw || '').match(/^(\d{1,2})[:.](\d{2})$/)
  if (!m) return null
  const h = Number(m[1])
  const mi = Number(m[2])
  return h <= 23 && mi <= 59 ? `${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}` : null
}

module.exports = {
  name: 'autogc',
  command: ['autogc', 'jadwalgc', 'autoclose'],
  category: 'group',
  emoji: '⏰',
  desc: 'Jadwal buka-tutup grup otomatis tiap hari (WIB)',
  usage: 'tutup 22:00 buka 06:00 | off | status',
  group: true,
  admin: true,
  run: async ({ sock, from, args, prefix, reply }) => {
    const g = gg.cfg(from)
    const a = g.auto
    const sub = (args[0] || 'status').toLowerCase()

    if (sub === 'off' || sub === 'hapus' || sub === 'reset') {
      g.auto = { open: null, close: null, lastOpen: '', lastClose: '' }
      gg.save()
      return reply('Jadwal buka-tutup otomatis dihapus.')
    }

    if (['tutup', 'close', 'buka', 'open'].includes(sub)) {
      const set = {}
      for (let i = 0; i < args.length; i += 2) {
        const key = String(args[i]).toLowerCase()
        const kind = ['tutup', 'close'].includes(key) ? 'close' : ['buka', 'open'].includes(key) ? 'open' : null
        const t = parseTime(args[i + 1])
        if (!kind || !t) return reply(`Format salah.\nContoh: ${prefix}autogc tutup 22:00 buka 06:00\nAtau salah satu: ${prefix}autogc tutup 22:00`)
        set[kind] = t
      }
      if (set.close) a.close = set.close
      if (set.open) a.open = set.open
      a.lastClose = ''
      a.lastOpen = ''
      gg.save()
      const meta = await sock.groupMetadata(from)
      const botAdmin = gg.botIsAdmin(sock, meta)
      return reply(`✅ Jadwal disimpan.\nTutup : ${a.close ? a.close + ' WIB' : '-'}\nBuka : ${a.open ? a.open + ' WIB' : '-'}${botAdmin ? '' : '\n⚠️ Jadikan bot admin supaya jadwal bisa berjalan.'}`)
    }

    await reply(
      panel('JADWAL BUKA-TUTUP', [
        { head: '⏰ *JADWAL SAAT INI*', lines: [`Tutup : ${a.close ? a.close + ' WIB' : '-'}`, `Buka : ${a.open ? a.open + ' WIB' : '-'}`] },
        { head: '📖 *PERINTAH*', lines: [`${prefix}autogc tutup 22:00 buka 06:00`, `${prefix}autogc tutup 23:30  (hanya tutup)`, `${prefix}autogc off  (hapus jadwal)`] }
      ], { tip: '💡 Jam WIB. Bot harus admin. Jadwal tetap jalan walau bot restart.' })
    )
  }
}
