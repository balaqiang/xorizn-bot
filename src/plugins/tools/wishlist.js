const { createStore } = require('../../lib/store')
const { userOf, rp } = require('../../lib/fx')
const { parseMoney } = require('../../lib/uitext')
const store = createStore('wishlist', { users: {} })
module.exports = {
  name: 'wishlist', command: ['wishlist', 'keinginan', 'impian'], category: 'tools', emoji: '🛍️', desc: 'Daftar barang impian + target harga', usage: 'add <harga> <nama> | list | del <no>',
  run: async ({ sender, args, prefix, reply }) => {
    const me = userOf(sender); const L = (store.data.users[me] ||= []); const sub = (args[0] || 'list').toLowerCase()
    if (sub === 'add') { const p = parseMoney(args[1]); const name = args.slice(2).join(' ').trim(); if (!p || !name) return reply(`Contoh: ${prefix}wishlist add 8jt Laptop baru`); if (L.length >= 30) return reply('Maksimal 30 item.'); L.push({ name, p }); store.save(); return reply(`🛍️ Ditambahkan: *${name}* (${rp(p)})`) }
    if (sub === 'del') { const i = parseInt(args[1], 10) - 1; if (!L[i]) return reply('Nomor tidak ada.'); const [x] = L.splice(i, 1); store.save(); return reply(`🗑️ Dihapus: ${x.name}`) }
    if (!L.length) return reply(`🛍️ *WISHLIST*\n\nKosong. Tambah: ${prefix}wishlist add 8jt Laptop baru`)
    const tot = L.reduce((a, b) => a + b.p, 0)
    await reply(`🛍️ *WISHLIST*\n\n${L.map((x, i) => `${i + 1}. ${x.name} — ${rp(x.p)}`).join('\n')}\n\n▬ *Total:* ${rp(tot)}\n💡 Menabung ${rp(Math.ceil(tot / 12))}/bulan → tercapai dalam 1 tahun`)
  }
}
