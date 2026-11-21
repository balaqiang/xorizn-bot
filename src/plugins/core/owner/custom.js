/**
 * Kelola perintah kustom dari WhatsApp (versi cepat). Perintah lengkap (API, ambil data, media)
 * dibuat dari dashboard → Perintah Kustom.
 */
import * as builder from '../../../features/builder/index.js'

const owner = (o) => ({ category: 'owner', owner: true, ...o })

export default [
  owner({
    command: ['addcustom', 'addcmdteks'],
    description: 'Buat perintah balasan teks. Variabel: {{sender.name}}, {{text}}, {{arg1}}, {{date}}',
    usage: 'nama | balasan',
    async run(m, { text, prefix, command }) {
      const i = text.indexOf('|')
      if (i < 0) return m.reply(`Format: *${prefix}${command} nama | teks balasan*\nContoh: *${prefix}${command} rules | Dilarang spam ya {{sender.name}}!*\n\nPerintah dengan API / gambar dibuat dari dashboard → Perintah Kustom.`)
      const name = text.slice(0, i).trim().toLowerCase()
      const reply = text.slice(i + 1).trim()
      const prev = builder.get(name)
      try {
        builder.save({ name, description: 'Balasan teks', category: 'custom', steps: [{ type: 'reply', kind: 'text', text: reply }] }, { previousName: prev ? name : null })
      } catch (err) {
        return m.reply(`❌ ${err.message}`)
      }
      return m.reply(`✅ Perintah *${prefix}${name}* ${prev ? 'diperbarui' : 'dibuat'}.`)
    }
  }),
  owner({
    command: ['delcustom', 'hapuscustom'],
    description: 'Hapus perintah kustom',
    usage: '<nama>',
    async run(m, { args, prefix, command }) {
      if (!args[0]) return m.reply(`Format: *${prefix}${command} nama*`)
      return m.reply(builder.remove(args[0].toLowerCase()) ? `🗑️ Perintah *${args[0]}* dihapus.` : 'Perintah kustom tidak ditemukan.')
    }
  }),
  owner({
    command: ['togglecustom', 'customonoff'],
    description: 'Aktifkan / nonaktifkan perintah kustom',
    usage: '<nama> on/off',
    async run(m, { args, prefix, command }) {
      const [name, v] = [String(args[0] || '').toLowerCase(), String(args[1] || '').toLowerCase()]
      if (!name || !['on', 'off'].includes(v)) return m.reply(`Format: *${prefix}${command} nama on/off*`)
      const doc = builder.setEnabled(name, v === 'on')
      return m.reply(doc ? `✅ *${name}* ${v === 'on' ? 'diaktifkan' : 'dinonaktifkan'}.` : 'Perintah kustom tidak ditemukan.')
    }
  }),
  owner({
    command: ['listcustom', 'customlist'],
    description: 'Daftar perintah kustom',
    async run(m, { prefix }) {
      const list = builder.list()
      if (!list.length) return m.reply(`Belum ada perintah kustom.\nBuat cepat: *${prefix}addcustom nama | balasan* atau lewat dashboard → Perintah Kustom.`)
      return m.reply(
        [`🧩 *Perintah kustom (${list.length})*`, '', ...list.map((c) => `${c.enabled === false ? '⏸️' : '✅'} ${prefix}${c.name}${c.aliases?.length ? ` (${c.aliases.join(', ')})` : ''} — ${c.steps.length} langkah${c.uses ? ` • dipakai ${c.uses}x` : ''}${c.lastError ? ' • ⚠️ error terakhir' : ''}`)].join('\n')
      )
    }
  })
]
