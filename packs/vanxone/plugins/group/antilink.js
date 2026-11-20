const { getGroup, setGroup } = require('../../lib/groups')

const modes = { on: 'wa', wa: 'wa', all: 'all', off: 'off' }
const names = { wa: 'link grup WhatsApp', all: 'semua link', off: 'mati' }

module.exports = {
  name: 'antilink',
  command: ['antilink'],
  category: 'group',
  desc: 'Hapus link yang dikirim member',
  usage: 'wa|all|off',
  admin: true,
  run: async ({ from, args, prefix, isBotAdmin, reply }) => {
    const mode = modes[(args[0] || '').toLowerCase()]

    if (!mode) {
      return reply(
        [
          '*ANTILINK*',
          `Status: ${names[getGroup(from).antilink]}`,
          '',
          `${prefix}antilink wa  - hapus link grup WhatsApp`,
          `${prefix}antilink all - hapus semua link`,
          `${prefix}antilink off - matikan`
        ].join('\n')
      )
    }

    if (mode !== 'off' && !isBotAdmin) {
      return reply('Jadikan bot sebagai admin grup dulu supaya bisa menghapus pesan.')
    }

    setGroup(from, { antilink: mode })
    await reply(`Antilink: ${names[mode]}.`)
  }
}
