const fs = require('fs')
const path = require('path')
const pm = require('../../lib/pluginmgr')

module.exports = {
  name: 'getfitur',
  command: ['getfitur', 'getplugin', 'ambilfitur'],
  category: 'owner',
  desc: 'Kirim file kode sebuah plugin',
  usage: '<perintah>',
  owner: true,
  run: async ({ sock, msg, from, args, prefix, plugins, reply }) => {
    const q = (args[0] || '').toLowerCase().replace(/^[./!#]/, '')
    if (!q) return reply(`Format: ${prefix}getfitur <perintah>`)
    const plugin = plugins.find((p) => pm.commandsOf(p).includes(q) || String(p.name).toLowerCase() === q)
    if (!plugin || !plugin.__file) return reply(`Tidak ada plugin dengan perintah/nama "${q}".`)
    await sock.sendMessage(from, { document: fs.readFileSync(plugin.__file), mimetype: 'text/javascript', fileName: path.basename(plugin.__file) }, { quoted: msg })
  }
}
