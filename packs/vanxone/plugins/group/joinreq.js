// .joinreq — kelola permintaan bergabung grup (mode persetujuan admin)
const { userOf } = require('../../lib/utils')
const { panel } = require('../../lib/uitext')

module.exports = {
  name: 'joinreq',
  command: ['joinreq', 'reqjoin', 'permintaanmasuk'],
  category: 'group',
  emoji: '📨',
  desc: 'Lihat, setujui, atau tolak permintaan bergabung grup',
  usage: '[approve|reject all|<no>] | mode on|off',
  group: true,
  admin: true,
  botAdmin: true,
  run: async ({ sock, msg, from, args, prefix, reply }) => {
    const sub = (args[0] || 'list').toLowerCase()

    if (sub === 'mode') {
      const v = (args[1] || '').toLowerCase()
      if (!['on', 'off'].includes(v)) return reply(`${prefix}joinreq mode on  → member baru harus disetujui admin\n${prefix}joinreq mode off → bebas bergabung`)
      await sock.groupJoinApprovalMode(from, v)
      return reply(`Persetujuan admin untuk member baru: *${v === 'on' ? 'aktif' : 'mati'}*.`)
    }

    let list = []
    try {
      list = (await sock.groupRequestParticipantsList(from)) || []
    } catch (err) {
      return reply(`Gagal mengambil daftar permintaan: ${err.message}\nPastikan mode persetujuan aktif (${prefix}joinreq mode on).`)
    }

    if (sub === 'approve' || sub === 'reject') {
      if (!list.length) return reply('Tidak ada permintaan bergabung.')
      const pick = (args[1] || '').toLowerCase()
      let chosen
      if (pick === 'all' || pick === 'semua') chosen = list
      else {
        const n = parseInt(pick, 10)
        if (!(n >= 1 && n <= list.length)) return reply(`Pilih nomor atau "all".\nContoh: ${prefix}joinreq ${sub} all  atau  ${prefix}joinreq ${sub} 2`)
        chosen = [list[n - 1]]
      }
      const res = await sock.groupRequestParticipantsUpdate(from, chosen.map((x) => x.jid), sub)
      const ok = (res || []).filter((r) => !r.error || String(r.status) === '200').length || chosen.length
      return reply(`${sub === 'approve' ? '✅ Disetujui' : '🚫 Ditolak'}: ${ok} dari ${chosen.length} permintaan.`)
    }

    if (!list.length) return reply(`Tidak ada permintaan bergabung saat ini.\nMode persetujuan diatur lewat ${prefix}joinreq mode on|off`)
    const shown = list.slice(0, 30)
    await sock.sendMessage(
      from,
      {
        text: panel('PERMINTAAN BERGABUNG', [{ head: `📨 *${list.length} MENUNGGU*`, lines: shown.map((x, i) => `${i + 1}. @${userOf(x.jid)}`) }], {
          tip: `💡 ${prefix}joinreq approve all • ${prefix}joinreq reject all • ${prefix}joinreq approve <no>`
        }),
        mentions: shown.map((x) => x.jid)
      },
      { quoted: msg }
    )
  }
}
