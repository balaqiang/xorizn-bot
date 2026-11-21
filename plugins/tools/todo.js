const { createStore } = require('../../lib/store')
const { userOf } = require('../../lib/utils')

const store = createStore('todo', { users: {} })
const MAX = 50
const list = (sender) => (store.data.users[userOf(sender)] ||= [])

module.exports = {
  name: 'todo',
  command: ['todo', 'tugas', 'daftartugas'],
  category: 'tools',
  desc: 'Daftar tugas pribadi: tambah, selesai, hapus',
  usage: 'add <tugas> | done <no> | del <no> | clear',
  run: async ({ sender, args, prefix, reply }) => {
    const items = list(sender)
    const sub = (args[0] || '').toLowerCase()
    const num = parseInt(args[1], 10)
    const bad = () => reply(`Nomor tidak valid. Lihat daftar: ${prefix}todo`)

    if (sub === 'add' || sub === 'tambah') {
      const text = args.slice(1).join(' ').trim()
      if (!text) return reply(`Tulis tugasnya.\nContoh: ${prefix}todo add beli beras`)
      if (items.length >= MAX) return reply(`Daftar penuh (maks ${MAX}). Hapus yang sudah selesai: ${prefix}todo clear`)
      items.push({ t: text.slice(0, 200), done: false, at: Date.now() })
      store.save()
      return reply(`✅ Ditambahkan sebagai #${items.length}: ${text.slice(0, 200)}`)
    }
    if (sub === 'done' || sub === 'selesai' || sub === 'ok') {
      if (!items[num - 1]) return bad()
      items[num - 1].done = !items[num - 1].done
      store.save()
      return reply(`${items[num - 1].done ? '✅ Selesai' : '↩️ Dibuka lagi'}: ${items[num - 1].t}`)
    }
    if (sub === 'del' || sub === 'hapus') {
      if (!items[num - 1]) return bad()
      const [gone] = items.splice(num - 1, 1)
      store.save()
      return reply(`🗑️ Dihapus: ${gone.t}`)
    }
    if (sub === 'clear' || sub === 'bersihkan') {
      const before = items.length
      store.data.users[userOf(sender)] = items.filter((x) => !x.done)
      store.save()
      return reply(`🧹 ${before - store.data.users[userOf(sender)].length} tugas selesai dibersihkan.`)
    }

    if (!items.length) return reply(`Belum ada tugas.\nTambah: ${prefix}todo add beli beras`)
    const open = items.filter((x) => !x.done).length
    await reply(
      [`📝 *TUGASMU* (${open} belum selesai)`, '', ...items.map((x, i) => `${i + 1}. ${x.done ? '✅ ~' + x.t + '~' : '⬜ ' + x.t}`), '', `${prefix}todo done <no> • ${prefix}todo del <no> • ${prefix}todo clear`].join('\n')
    )
  }
}
