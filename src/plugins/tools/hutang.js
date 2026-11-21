// .hutang — catat hutang-piutang pribadi
const { createStore } = require('../../lib/store')
const { userOf, rp } = require('../../lib/fx')
const { parseMoney } = require('../../lib/uitext')
const store = createStore('hutang', { users: {} })
module.exports = {
  name: 'hutang', command: ['hutang', 'piutang', 'utang'], category: 'tools', emoji: '📒', desc: 'Catat hutang & piutang pribadi', usage: 'pinjam <nama> <jumlah> [ket] | utang <nama> <jumlah> [ket] | list | lunas <no>',
  run: async ({ sender, args, prefix, reply }) => {
    const me = userOf(sender); const L = (store.data.users[me] ||= [])
    const sub = (args[0] || 'list').toLowerCase()
    if (['pinjam', 'utang', 'piutang', 'hutang'].includes(sub) && args.length >= 3) {
      const n = parseMoney(args[2]); const who = args[1]
      if (!n || n <= 0) return reply(`Contoh: ${prefix}hutang pinjam Andi 50rb makan siang\n(${prefix}hutang utang Budi 100rb → kamu yang berhutang)`)
      if (L.length >= 50) return reply('Catatan penuh (50). Lunasi dulu beberapa.')
      const type = sub === 'utang' || sub === 'hutang' ? 'owe' : 'lent'
      L.push({ who, n, note: args.slice(3).join(' '), type, at: Date.now() }); store.save()
      return reply(type === 'lent' ? `📒 Dicatat: *${who}* berhutang ${rp(n)} padamu.` : `📒 Dicatat: kamu berhutang ${rp(n)} ke *${who}*.`)
    }
    if (sub === 'lunas') {
      const i = parseInt(args[1], 10) - 1; if (!L[i]) return reply('Nomor tidak ada.')
      const [x] = L.splice(i, 1); store.save(); return reply(`✅ Lunas: ${x.who} — ${rp(x.n)}`)
    }
    if (sub === 'reset') { store.data.users[me] = []; store.save(); return reply('Semua catatan dihapus.') }
    if (!L.length) return reply(`📒 *HUTANG-PIUTANG*\n\nBelum ada catatan.\n➥ ${prefix}hutang pinjam Andi 50rb (Andi hutang ke kamu)\n➥ ${prefix}hutang utang Budi 20rb (kamu hutang ke Budi)`)
    const lent = L.filter((x) => x.type === 'lent').reduce((a, b) => a + b.n, 0), owe = L.filter((x) => x.type === 'owe').reduce((a, b) => a + b.n, 0)
    await reply(`📒 *HUTANG-PIUTANG*\n\n▬ *Piutang (hakmu):* ${rp(lent)}\n▬ *Hutang (kewajibanmu):* ${rp(owe)}\n▬ *Neto:* ${rp(Math.abs(lent - owe))} ${lent >= owe ? '(kamu untung)' : '(kamu masih berhutang)'}\n\n${L.map((x, i) => `${i + 1}. ${x.type === 'lent' ? '⬅️' : '➡️'} ${x.who} • ${rp(x.n)}${x.note ? ` • ${x.note}` : ''}`).join('\n')}\n\n💡 ${prefix}hutang lunas <no>`)
  }
}
