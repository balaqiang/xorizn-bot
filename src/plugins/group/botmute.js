const { getGroup, setGroup } = require('../../lib/groups')

module.exports = {
  name: 'botmute',
  command: ['botmute', 'mutebot'],
  category: 'group',
  desc: 'Bot hanya merespons admin di grup ini',
  usage: 'on|off',
  admin: true,
  run: async ({ from, args, prefix, reply }) => {
    const sub = (args[0] || '').toLowerCase()
    if (sub !== 'on' && sub !== 'off') {
      return reply(`Status: ${getGroup(from).muted ? 'bot di-mute (hanya admin)' : 'bot aktif untuk semua'}\n${prefix}botmute on | off`)
    }
    setGroup(from, { muted: sub === 'on' })
    await reply(sub === 'on' ? 'Bot di-mute. Hanya admin yang bisa memakai perintah di grup ini.' : 'Bot aktif lagi untuk semua member.')
  }
}
