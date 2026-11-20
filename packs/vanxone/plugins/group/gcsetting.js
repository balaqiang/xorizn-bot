// Pengaturan grup praktis: pesan sementara, kunci info grup, siapa yang boleh menambah member
const { panel } = require('../../lib/uitext')

const EPHEMERAL = { off: 0, '24j': 86400, '1d': 86400, '1h': 86400, '7h': 604800, '7d': 604800, '90h': 7776000, '90d': 7776000 }

module.exports = {
  name: 'gcsetting',
  command: ['pesansementara', 'kunciinfo', 'addmode'],
  category: 'group',
  emoji: '⚙️',
  desc: 'Pesan sementara, kunci info grup, dan izin menambah member',
  usage: '24j|7h|90h|off  •  kunciinfo on|off  •  addmode admin|semua',
  group: true,
  admin: true,
  botAdmin: true,
  run: async ({ sock, from, command, args, prefix, reply }) => {
    const v = (args[0] || '').toLowerCase()

    if (command === 'pesansementara') {
      if (!(v in EPHEMERAL)) return reply(panel('PESAN SEMENTARA', [{ head: '📖 *PILIHAN*', lines: [`${prefix}pesansementara 24j  → hilang 24 jam`, `${prefix}pesansementara 7h  → hilang 7 hari`, `${prefix}pesansementara 90h  → hilang 90 hari`, `${prefix}pesansementara off  → matikan`] }]))
      await sock.groupToggleEphemeral(from, EPHEMERAL[v])
      return reply(v === 'off' ? 'Pesan sementara dimatikan.' : `Pesan sementara aktif: pesan baru hilang setelah ${v === '24j' || v === '1d' || v === '1h' ? '24 jam' : v.startsWith('7') ? '7 hari' : '90 hari'}.`)
    }

    if (command === 'kunciinfo') {
      if (!['on', 'off'].includes(v)) return reply(`${prefix}kunciinfo on  → hanya admin yang boleh ubah nama, foto, & deskripsi grup\n${prefix}kunciinfo off → semua member boleh`)
      await sock.groupSettingUpdate(from, v === 'on' ? 'locked' : 'unlocked')
      return reply(v === 'on' ? '🔒 Info grup dikunci: hanya admin yang bisa mengubah nama, foto, dan deskripsi.' : '🔓 Info grup dibuka: semua member boleh mengubahnya.')
    }

    // addmode
    const mode = { admin: 'admin_add', semua: 'all_member_add', all: 'all_member_add', member: 'all_member_add' }[v]
    if (!mode) return reply(`${prefix}addmode admin  → hanya admin yang bisa menambah member\n${prefix}addmode semua → semua member bisa menambah`)
    await sock.groupMemberAddMode(from, mode)
    await reply(mode === 'admin_add' ? 'Sekarang hanya admin yang bisa menambah member.' : 'Sekarang semua member bisa menambah member.')
  }
}
