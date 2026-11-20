// .chinfo — info & ID saluran dari link
const ch = require('../../lib/channels')
const { panel } = require('../../lib/uitext')

module.exports = {
  name: 'chinfo',
  command: ['chinfo', 'infoch'],
  category: 'channel',
  emoji: 'ℹ️',
  desc: 'Info saluran (nama, ID, pengikut) dari link',
  usage: '<link saluran>',
  run: async ({ sock, body, prefix, reply }) => {
    const arg = String(body || '').replace(/^\S+\s*/, '').trim().split(/\s+/)[0]
    try {
      let ref = ch.parseRef(arg)
      if (!ref && !arg && ch.getCurrent()) ref = { type: 'jid', jid: ch.getCurrent().id }
      if (!ref) return reply(`Kirim link saluran.\nContoh: ${prefix}chinfo https://whatsapp.com/channel/0029VaXXXXXXXXXX`)
      const md = await ch.metadata(sock, ref)
      const date = md.created ? new Date(md.created * 1000).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta', day: 'numeric', month: 'long', year: 'numeric' }) : '-'
      await reply(
        panel('INFO SALURAN', [
          {
            head: '📢 *SALURAN*',
            lines: [`Nama : ${md.name}${md.verified ? ' ✅' : ''}`, `Pengikut : ${md.subs.toLocaleString('id-ID')}`, `Dibuat : ${date}`, md.role && `Peran bot : ${md.role.toLowerCase()}`, md.invite && `Link : ${ch.link(md.invite)}`].filter(Boolean)
          },
          { head: '🆔 *ID (JID)*', lines: [md.id], plain: true },
          md.desc && { head: '📝 *DESKRIPSI*', lines: [md.desc.length > 300 ? `${md.desc.slice(0, 299)}…` : md.desc], plain: true }
        ].filter(Boolean))
      )
    } catch (err) {
      console.log('[CH] chinfo:', err.message)
      await reply(`❌ ${ch.explain(err)}`)
    }
  }
}
