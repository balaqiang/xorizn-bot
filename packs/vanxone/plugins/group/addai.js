module.exports = {
  name: 'addai',
  command: ['addai'],
  category: 'group',
  desc: 'Add Meta AI ke grup',
  usage: 'addai',
  group: true,
  admin: true,
  run: async ({ sock, msg, from, sender, args, text, prefix, reply }) => {
    const m = msg
    const conn = sock
    const groupJid = from

    try {
      if (!groupJid.endsWith('@g.us')) {
        return reply('Command ini hanya untuk grup.')
      }

      const res = await conn.groupParticipantsUpdate(
        groupJid,
        ['867051314767696@bot'],
        'add'
      )

      return reply('Sukses add Meta AI ke grup ✅')

    } catch (e) {
      console.error(e)
      return reply(String(e?.stack || e))
    }
  }
}
