/** Auto-respon kata kunci. Di grup → khusus grup itu (admin). Di chat pribadi oleh owner → global. */
function target(m, ctx) {
  if (m.isGroup) return { list: ctx.group.autoResponses, scope: 'grup ini' }
  if (ctx.isOwner) return { list: ctx.settings.autoResponses, scope: 'global' }
  return null
}

export default [
  {
    command: ['addrespon', 'addrespond', 'addautorespon'],
    category: 'tools',
    description: 'Tambah auto-respon. Tambah "*" di depan kata kunci agar cocok sebagian',
    usage: 'kata kunci | balasan',
    admin: false,
    async run(m, ctx) {
      if (m.isGroup && !ctx.isAdmin) return m.reply('Khusus admin grup.')
      const t = target(m, ctx)
      if (!t) return m.reply('Auto-respon global hanya untuk owner.')
      const [trigger, ...rest] = ctx.text.split('|')
      const response = rest.join('|').trim()
      if (!trigger?.trim() || !response) return m.reply(`Format: ${ctx.prefix}addrespon halo | Halo juga @user!`)
      const exact = !trigger.trim().startsWith('*')
      const key = trigger.trim().replace(/^\*/, '').toLowerCase()
      const i = t.list.findIndex((x) => x.trigger === key)
      if (i !== -1) t.list.splice(i, 1)
      t.list.push({ trigger: key, response, exact })
      ctx.db.save()
      return m.reply(`✅ Auto-respon "${key}" ditambahkan (${t.scope}, ${exact ? 'sama persis' : 'mengandung'}).`)
    }
  },
  {
    command: ['delrespon', 'delautorespon'],
    category: 'tools',
    description: 'Hapus auto-respon',
    usage: '<kata kunci>',
    async run(m, ctx) {
      if (m.isGroup && !ctx.isAdmin) return m.reply('Khusus admin grup.')
      const t = target(m, ctx)
      if (!t) return m.reply('Khusus owner.')
      const key = ctx.text.trim().toLowerCase()
      const i = t.list.findIndex((x) => x.trigger === key)
      if (i === -1) return m.reply('Kata kunci tidak ditemukan.')
      t.list.splice(i, 1)
      ctx.db.save()
      return m.reply(`✅ Auto-respon "${key}" dihapus.`)
    }
  },
  {
    command: ['listrespon', 'listautorespon'],
    category: 'tools',
    description: 'Daftar auto-respon',
    async run(m, ctx) {
      const t = target(m, ctx)
      if (!t) return m.reply('Khusus owner.')
      if (!t.list.length) return m.reply(`Belum ada auto-respon (${t.scope}).`)
      return m.reply(`💬 *Auto-respon (${t.scope})*\n\n${t.list.map((x, i) => `${i + 1}. ${x.exact ? '' : '*'}${x.trigger} → ${x.response.slice(0, 60)}`).join('\n')}`)
    }
  }
]
