const pm = require('../../lib/pluginmgr')

module.exports = {
  name: 'delfitur',
  command: ['delfitur', 'delplugin', 'hapusfitur'],
  category: 'owner',
  desc: 'Hapus plugin berdasarkan perintahnya (dicadangkan dulu)',
  usage: '<perintah>',
  owner: true,
  run: async ({ args, prefix, plugins, reloadPlugins, reply }) => {
    const q = (args[0] || '').toLowerCase().replace(/^[./!#]/, '')
    if (!q) return reply(`Format: ${prefix}delfitur <perintah>\nContoh: ${prefix}delfitur halo`)
    const plugin = plugins.find((p) => pm.commandsOf(p).includes(q) || String(p.name).toLowerCase() === q)
    if (!plugin) return reply(`Tidak ada plugin dengan perintah/nama "${q}".`)
    const r = pm.remove({ plugin, reload: reloadPlugins })
    if (r.error) return reply(`❌ ${r.error}`)
    await reply(`🗑️ Dihapus: plugins/${r.file}\nCadangan: database/plugin-backup/${r.backup}\nPulihkan dengan ${prefix}addfitur (kirim file cadangan).`)
  }
}
