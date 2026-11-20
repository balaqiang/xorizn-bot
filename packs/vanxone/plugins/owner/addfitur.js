const pm = require('../../lib/pluginmgr')
const { getMedia, getQuotedText } = require('../../lib/utils')

module.exports = {
  name: 'addfitur',
  command: ['addfitur', 'addplugin', 'pasangfitur'],
  category: 'owner',
  desc: 'Pasang/ganti plugin langsung dari WhatsApp (tanpa restart)',
  usage: '[kategori/]<nama> [-f]  + kode (tempel / reply / kirim file .js)',
  owner: true,
  run: async ({ sock, msg, body, args, prefix, plugins, reloadPlugins, reply }) => {
    if ((args[0] || '').toLowerCase() === 'template') return reply(`*TEMPLATE PLUGIN*\n\n\`\`\`${pm.TEMPLATE}\`\`\`\n\nSimpan sebagai file lalu kirim: ${prefix}addfitur nama`)

    const force = args.includes('-f')
    const words = args.filter((a) => a !== '-f')
    const spec = words[0] || ''
    if (!spec) {
      return reply(
        `*PASANG FITUR*\n\n1) Tempel kode setelah perintah:\n${prefix}addfitur tools/halo\n<kode plugin>\n\n2) Reply pesan berisi kode / kirim file .js dengan caption:\n${prefix}addfitur tools/halo\n\n• Tanpa kategori → mengikuti field category di kode\n• Timpa yang sudah ada: tambahkan -f\n• Contoh kerangka: ${prefix}addfitur template\n• Hapus: ${prefix}delfitur <perintah> • Ambil file: ${prefix}getfitur <perintah> • Muat ulang semua: ${prefix}reloadfitur\n\n⚠️ Plugin berjalan dengan akses penuh ke server. Pasang hanya kode yang kamu percaya.`
      )
    }
    const [maybeCat, maybeName] = spec.includes('/') ? spec.split('/') : [null, spec]
    const name = (maybeName || '').replace(/\.js$/i, '')
    const category = maybeCat || null
    if (category && !pm.validName(category)) return reply('Nama kategori tidak valid.')

    // sumber kode: file .js > pesan yang di-reply > teks setelah baris pertama perintah
    let raw = ''
    const doc = await getMedia(sock, msg, ['documentMessage']).catch(() => null)
    if (doc) raw = doc.buffer.toString('utf8')
    if (!raw) raw = getQuotedText(msg)
    if (!raw) {
      const nl = String(body || '').indexOf('\n')
      if (nl !== -1) raw = body.slice(nl + 1)
    }
    if (!raw.trim()) return reply(`Kode tidak ditemukan. Tempel kode di baris setelah perintah, reply pesan berisi kode, atau kirim file .js.\nContoh kerangka: ${prefix}addfitur template`)

    const r = pm.install({ code: pm.cleanCode(raw), category, name, force, current: plugins, reload: reloadPlugins })
    if (r.error) return reply(`❌ ${r.error}`)

    await reply(
      [
        `✅ *Fitur ${r.overwritten ? 'diganti' : 'terpasang'}!*`,
        '',
        `▬ *File:* plugins/${r.cat}/${r.name}.js`,
        `▬ *Perintah:* ${r.cmds.map((c) => prefix + c).join(', ')}`,
        r.plugin.desc && `▬ *Deskripsi:* ${r.plugin.desc}`,
        r.backup && `▬ *Cadangan lama:* database/plugin-backup/${r.backup}`,
        '',
        'Langsung aktif, tidak perlu restart.'
      ].filter(Boolean).join('\n')
    )
  }
}
