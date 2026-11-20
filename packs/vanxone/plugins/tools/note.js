const { createStore } = require('../../lib/store')
const { userOf } = require('../../lib/utils')

const store = createStore('notes', {})
const MAX = 50

module.exports = {
  name: 'note',
  command: ['note', 'catat', 'notes'],
  category: 'tools',
  desc: 'Catatan pribadi',
  usage: 'add <teks> | list | del <no> | clear',
  run: async ({ sender, args, body, prefix, reply }) => {
    const id = userOf(sender)
    const notes = (store.data[id] = store.data[id] || [])
    const sub = (args[0] || 'list').toLowerCase()

    if (sub === 'add' || sub === 'tambah') {
      const text = body.match(/^\S+\s+\S+\s+([\s\S]+)/)?.[1]?.trim()
      if (!text) return reply(`Contoh: ${prefix}note add beli susu`)
      if (notes.length >= MAX) return reply(`Catatan penuh (maks ${MAX}). Hapus dulu dengan ${prefix}note del <no>.`)
      notes.push({ text: text.slice(0, 500), time: Date.now() })
      store.save()
      return reply(`Catatan #${notes.length} disimpan.`)
    }

    if (sub === 'del' || sub === 'hapus') {
      const n = parseInt(args[1], 10)
      if (!n || n < 1 || n > notes.length) return reply('Nomor catatan tidak valid.')
      notes.splice(n - 1, 1)
      store.save()
      return reply(`Catatan #${n} dihapus.`)
    }

    if (sub === 'clear') {
      store.data[id] = []
      store.save()
      return reply('Semua catatan dihapus.')
    }

    if (!notes.length) return reply(`Belum ada catatan. Tambah dengan ${prefix}note add <teks>`)
    await reply(['*CATATAN KAMU*', '', ...notes.map((n, i) => `${i + 1}. ${n.text}`)].join('\n'))
  }
}
