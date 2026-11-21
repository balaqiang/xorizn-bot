const { createStore } = require('../../lib/store')
const { rp, parseAmount } = require('../../lib/game')
const { userOf } = require('../../lib/utils')

const store = createStore('uang', { users: {} })
const MAX = 500
const tx = (sender) => (store.data.users[userOf(sender)] ||= [])
const monthKey = (t) => new Date(t).toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }).slice(0, 7)
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

module.exports = {
  name: 'uang',
  command: ['uang', 'keuangan', 'catatuang'],
  category: 'tools',
  desc: 'Pencatat keuangan pribadi: pemasukan, pengeluaran, ringkasan bulanan',
  usage: 'keluar <jumlah> <catatan> | masuk <jumlah> <catatan> | hapus <no>',
  run: async ({ sender, args, prefix, reply }) => {
    const items = tx(sender)
    const sub = (args[0] || '').toLowerCase()

    if (['keluar', 'masuk', 'out', 'in'].includes(sub)) {
      const amount = parseAmount(args[1], null)
      if (!amount || amount < 1) return reply(`Format: ${prefix}uang ${sub} <jumlah> <catatan>\nContoh: ${prefix}uang ${sub} ${sub.startsWith('m') || sub === 'in' ? '5jt gaji' : '25rb makan siang'}`)
      if (items.length >= MAX) items.shift()
      const type = sub === 'masuk' || sub === 'in' ? 'in' : 'out'
      items.push({ type, amount, note: args.slice(2).join(' ').slice(0, 80) || '-', at: Date.now() })
      store.save()
      return reply(`${type === 'in' ? '📥 Pemasukan' : '📤 Pengeluaran'} dicatat: ${rp(amount)} — ${items[items.length - 1].note}\nLihat ringkasan: ${prefix}uang`)
    }

    if (sub === 'hapus' || sub === 'del') {
      const n = parseInt(args[1], 10)
      const thisMonth = items.map((x, i) => ({ x, i })).filter(({ x }) => monthKey(x.at) === monthKey(Date.now()))
      if (!thisMonth[n - 1]) return reply(`Nomor tidak valid. Nomor ada di daftar ${prefix}uang`)
      const [gone] = items.splice(thisMonth[n - 1].i, 1)
      store.save()
      return reply(`🗑️ Dihapus: ${gone.type === 'in' ? 'masuk' : 'keluar'} ${rp(gone.amount)} — ${gone.note}`)
    }

    // ringkasan bulan ini
    const key = monthKey(Date.now())
    const month = items.filter((x) => monthKey(x.at) === key)
    if (!month.length) return reply(`Belum ada catatan bulan ini.\n${prefix}uang keluar 25rb makan siang\n${prefix}uang masuk 5jt gaji`)
    const inn = month.filter((x) => x.type === 'in').reduce((a, b) => a + b.amount, 0)
    const out = month.filter((x) => x.type === 'out').reduce((a, b) => a + b.amount, 0)
    const [y, m] = key.split('-').map(Number)
    const day = (t) => new Date(t).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta', day: 'numeric', month: 'short' })
    await reply(
      [
        `💰 *KEUANGAN ${BULAN[m - 1].toUpperCase()} ${y}*`,
        '',
        `📥 Pemasukan : ${rp(inn)}`,
        `📤 Pengeluaran: ${rp(out)}`,
        `⚖️ Saldo      : ${inn - out < 0 ? '-' : ''}${rp(Math.abs(inn - out))}`,
        '',
        '*Transaksi terakhir*',
        ...month.slice(-8).map((x, i, a) => `${month.length - a.length + i + 1}. ${x.type === 'in' ? '📥' : '📤'} ${rp(x.amount)} • ${x.note} (${day(x.at)})`),
        '',
        `${prefix}uang hapus <no> untuk menghapus`
      ].join('\n')
    )
  }
}
