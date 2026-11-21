const antispam = require('../../lib/antispam')

module.exports = {
  name: 'antispam',
  command: ['antispam', 'antiflood'],
  category: 'group',
  desc: 'Anti-spam: tindak member yang kirim pesan beruntun (on/off)',
  usage: 'on | off',
  group: true,
  admin: true,
  run: async ({ from, args, prefix, reply }) => {
    const v = (args[0] || '').toLowerCase()
    if (v === 'on' || v === 'off') {
      antispam.setEnabled(from, v === 'on')
      return reply(
        v === 'on'
          ? `✅ Anti-spam aktif. Member (non-admin) yang mengirim ${antispam.LIMIT}+ pesan dalam ${antispam.WINDOW / 1000} detik akan diperingatkan.\nJika bot admin, pesan spam ikut dihapus.`
          : '❎ Anti-spam dimatikan.'
      )
    }
    await reply(`Anti-spam: *${antispam.enabled(from) ? 'AKTIF' : 'MATI'}*\nGunakan: ${prefix}antispam on / off`)
  }
}
