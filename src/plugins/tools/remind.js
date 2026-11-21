const { parseDuration, add, listOf, removeAt } = require('../../lib/scheduler')
const { formatUptime } = require('../../lib/utils')

const when = (at) =>
  new Date(at)
    .toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
    .replace(/(\d)\.(\d)/g, '$1:$2')

module.exports = {
  name: 'remind',
  command: ['remind', 'ingatkan', 'pengingat'],
  category: 'tools',
  desc: 'Pengingat (bertahan walau bot restart)',
  usage: '<10m|2j|1d> <pesan> | list | del <no>',
  run: async ({ from, sender, args, prefix, reply }) => {
    const sub = (args[0] || '').toLowerCase()

    if (sub === 'list' || sub === 'daftar') {
      const items = listOf(sender)
      if (!items.length) return reply('Belum ada pengingat aktif.')
      return reply(
        ['*PENGINGAT AKTIF*', '', ...items.map((r, i) => `${i + 1}. ${r.text}\n   ⏰ ${when(r.at)} WIB (${formatUptime((r.at - Date.now()) / 1000)} lagi)`)].join('\n')
      )
    }

    if (sub === 'del' || sub === 'hapus') {
      const n = parseInt(args[1], 10)
      return reply(n && removeAt(sender, n) ? `Pengingat #${n} dihapus.` : `Nomor tidak valid. Lihat daftar: ${prefix}remind list`)
    }

    const ms = parseDuration(sub)
    const text = args.slice(1).join(' ').trim()
    if (!ms || !text) {
      return reply(`Contoh:\n${prefix}remind 30m minum obat\n${prefix}remind 2j rapat\n${prefix}remind 1h30m masak nasi\n${prefix}remind list\n\nSatuan: s (detik), m (menit), j/h (jam), d (hari).`)
    }

    const res = add({ jid: from, user: sender, text, ms })
    if (res.error) return reply(res.error)
    await reply(`✅ Oke, aku ingatkan pada ${when(res.item.at)} WIB (${formatUptime(ms / 1000)} lagi).`)
  }
}
