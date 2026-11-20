const absen = require('../../lib/absen')
const { btn } = require('../../lib/interactive')
const { sendGame } = require('../../lib/richgame')
const { userOf } = require('../../lib/utils')

const wib = (t) => new Date(t).toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' })

function rekap(a, closed) {
  return [
    `📋 *ABSENSI: ${a.title}*`,
    `Dibuka: ${wib(a.at)} WIB${closed ? '  •  *SELESAI*' : ''}`,
    '',
    a.list.length ? a.list.map((x, i) => `${i + 1}. @${x.id} (${wib(x.at)})`).join('\n') : '_Belum ada yang hadir._',
    '',
    `Total hadir: ${a.list.length}`
  ].join('\n')
}

module.exports = {
  name: 'absen',
  command: ['absen', 'hadir', 'presensi'],
  category: 'group',
  desc: 'Absensi grup: admin buka sesi, member tekan Hadir',
  usage: 'mulai <judul> | (hadir) | rekap | selesai',
  group: true,
  run: async (ctx) => {
    const { sock, msg, from, sender, args, prefix, isAdmin, isOwner, config, reply } = ctx
    const sub = (args[0] || '').toLowerCase()
    const a = absen.get(from)
    const hadirBtn = [btn.reply('✋ Hadir', `${prefix}absen`), btn.reply('📋 Rekap', `${prefix}absen rekap`)]

    if (sub === 'mulai' || sub === 'buka') {
      if (!isAdmin && !isOwner) return reply('Hanya admin yang bisa membuka absensi.')
      const title = args.slice(1).join(' ').trim() || 'Absensi'
      const n = absen.start(from, title.slice(0, 80), sender)
      return sendGame(ctx, { body: `📋 *ABSENSI DIBUKA*\n\n*${n.title}*\n\nTekan tombol Hadir atau ketik ${prefix}absen`, buttons: hadirBtn })
    }

    if (sub === 'rekap' || sub === 'list') {
      if (!a) return reply(`Tidak ada absensi aktif. Admin: ${prefix}absen mulai <judul>`)
      return sock.sendMessage(from, { text: rekap(a), mentions: a.list.map((x) => x.jid) }, { quoted: msg })
    }

    if (sub === 'selesai' || sub === 'tutup') {
      if (!isAdmin && !isOwner) return reply('Hanya admin yang bisa menutup absensi.')
      if (!a) return reply('Tidak ada absensi aktif.')
      absen.end(from)
      return sock.sendMessage(from, { text: rekap(a, true), mentions: a.list.map((x) => x.jid) }, { quoted: msg })
    }

    if (!a) return reply(`Tidak ada absensi aktif. Admin: ${prefix}absen mulai <judul>`)
    const r = absen.mark(from, sender, msg.pushName)
    if (r.error === 'dup') return reply(`@${userOf(sender)} sudah absen.`.replace(/@\d+/, 'Kamu'))
    await sock.sendMessage(from, { text: `✅ @${userOf(sender)} hadir (#${r.count}) — *${a.title}*`, mentions: [sender] }, { quoted: msg })
  }
}
