// .setch — atur saluran tujuan bawaan untuk .swch, .playch, .chname, dll
const ch = require('../../lib/channels')
const { panel } = require('../../lib/uitext')

module.exports = {
  name: 'setch',
  command: ['setch', 'setsaluran', 'saluranku'],
  category: 'channel',
  emoji: '📌',
  desc: 'Atur saluran tujuan bawaan (untuk swch, playch, dll)',
  usage: '<link saluran> | off',
  owner: true,
  run: async ({ sock, body, prefix, reply }) => {
    const arg = String(body || '').replace(/^\S+\s*/, '').trim()
    const cur = ch.getCurrent()

    if (!arg) {
      return reply(
        panel('SALURAN TUJUAN', [
          { head: '📌 *SALURAN BAWAAN*', lines: cur ? [`Nama : ${cur.name}`, `ID : ${cur.id}`, `Peran bot : ${cur.role ? cur.role.toLowerCase() : 'tidak diketahui'}`] : ['Belum diatur'] },
          { head: '📖 *CARA PAKAI*', lines: [`${prefix}setch <link saluran>`, `${prefix}setch off  (hapus)`, `Setelah itu: ${prefix}swch, ${prefix}playch, ${prefix}chname, dll`] }
        ], { tip: '💡 Nomor bot harus jadi admin/pemilik saluran supaya bisa memposting.' })
      )
    }
    if (['off', 'hapus', 'reset'].includes(arg.toLowerCase())) {
      ch.setCurrent(null)
      return reply('Saluran bawaan dihapus.')
    }

    const ref = ch.parseRef(arg)
    if (!ref) return reply(`Itu bukan link/ID saluran.\nContoh: ${prefix}setch https://whatsapp.com/channel/0029VaXXXXXXXXXX`)
    try {
      const md = await ch.metadata(sock, ref)
      ch.setCurrent({ id: md.id, name: md.name, role: md.role })
      const warn = md.role && !ch.isAdminRole(md.role) ? `\n⚠️ Akun bot hanya "${md.role.toLowerCase()}" di saluran ini. Jadikan admin dulu supaya bisa memposting.` : ''
      await reply(`✅ Saluran bawaan: *${md.name}*\nPengikut: ${md.subs.toLocaleString('id-ID')}${md.role ? `\nPeran bot: ${md.role.toLowerCase()}` : ''}${warn}`)
    } catch (err) {
      console.log('[CH] setch:', err.message)
      await reply(`❌ ${ch.explain(err)}`)
    }
  }
}
