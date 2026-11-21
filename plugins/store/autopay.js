// Payment gateway QRIS otomatis (AutoOrder): .bayarqris .topup .premqris .statusbayar .batalbayar .riwayatbayar .aosaldo
// Mesin & pemantau tagihan ada di lib/autopay.js, client API di lib/autoorder.js, kunci API di settings.js (global.autoorder).
const ao = require('../../lib/autoorder')
const AP = require('../../lib/autopay')
const shop = require('../../lib/shop')
const db = require('../../lib/db')
const { card, rows, btn } = require('../../lib/shopui')

const rp = shop.rupiah
const num = (n) => Number(n).toLocaleString('id-ID')

// "10000", "10.000", "10k", "10rb", "1,5jt" -> angka rupiah
function parseAmount(raw) {
  const s = String(raw || '').toLowerCase().replace(/rp/g, '').replace(/\s+/g, '')
  const m = s.match(/^(\d+(?:[.,]\d+)?)(k|rb|ribu|jt|juta)?$/)
  if (!m) return 0
  let v = m[1]
  if (m[2]) v = Number(v.replace(',', '.')) * (m[2] === 'k' || m[2] === 'rb' || m[2] === 'ribu' ? 1000 : 1000000)
  else v = Number(v.replace(/[.,]/g, ''))
  return Math.round(v) || 0
}

const premiumPlans = () => {
  const out = []
  for (const [d, price] of Object.entries(ao.cfg().premium || {})) {
    const days = parseInt(d, 10)
    const p = Math.round(Number(price))
    if (days > 0 && p >= 300) out.push({ days, price: p })
  }
  return out.sort((a, b) => a.days - b.days)
}

module.exports = {
  name: 'autopay',
  command: ['bayarqris', 'payqris', 'topup', 'isisaldo', 'premqris', 'statusbayar', 'batalbayar', 'riwayatbayar', 'aosaldo', 'aoinfo'],
  category: 'store',
  desc: 'Pembayaran QRIS otomatis (order toko, topup saldo, premium)',
  usage: '<bayarqris kode-order> | <topup nominal> | <premqris hari> | <statusbayar> | <batalbayar kode>',
  run: async (ctx) => {
    const { command, args, prefix, isOwner, sock, sender, from } = ctx
    AP.attach(sock)
    AP.start()

    const fail = (e) => {
      if (e && e.user) return ctx.reply(e.message)
      console.log('[AUTOPAY]', command, e && e.message)
      if (e && e.code === 'NO_KEY') return ctx.reply(isOwner ? e.message : 'Pembayaran QRIS otomatis belum diaktifkan owner.')
      return ctx.reply(`Gagal memproses pembayaran: ${e && e.message ? e.message : 'kesalahan tidak dikenal'}.\nCoba lagi sebentar lagi, atau hubungi owner.`)
    }
    const need = () => {
      if (ao.enabled()) return false
      ctx.reply(isOwner ? `API key AutoOrder belum diisi. Buka settings.js, isi global.autoorder.apiKey, lalu restart bot.` : 'Pembayaran QRIS otomatis belum diaktifkan owner. Hubungi owner untuk bayar manual.')
      return true
    }
    const mine = (inv) => isOwner || AP.same(inv.buyer, sender)

    try {
      // ---------- owner: info akun AutoOrder ----------
      if (command === 'aosaldo' || command === 'aoinfo') {
        if (!isOwner) return ctx.reply(ctx.config.mess.only.owner)
        if (need()) return
        const [acc, bal] = await Promise.all([ao.account().catch(() => null), ao.balance()])
        const pend = AP.pending()
        const body = ['*AUTOORDER*', '', rows([
          ['Akun', (acc && acc.username) || bal.username],
          ['Role', (acc && acc.role) || bal.role],
          ['Saldo', bal.formattedBalance || rp(bal.balance)],
          acc && acc.stats ? ['Deposit', rp(acc.stats.totalDeposit)] : null,
          acc && acc.stats ? ['Terpakai', rp(acc.stats.totalSpent)] : null,
          ['Tagihan aktif', pend.length],
          ['Total tagihan', AP.list().length]
        ].filter(Boolean))].join('\n')
        return card(ctx, { body, buttons: [btn.reply('Riwayat tagihan', `${prefix}riwayatbayar`)], fallback: body })
      }

      // ---------- bayar order toko ----------
      if (command === 'bayarqris' || command === 'payqris') {
        if (need()) return
        const o = shop.getOrder(args[0])
        if (!o) return ctx.reply(`Format: ${prefix}bayarqris <kode order>\nKode order dikirim bot saat kamu ${prefix}beli produk.`)
        if (!isOwner && !AP.same(o.buyer, sender)) return ctx.reply('Order ini bukan milikmu.')
        if (o.status !== 'pending') return ctx.reply(`Order ${o.id} berstatus ${o.status.toUpperCase()}, tidak bisa dibayar lagi.`)
        const p = shop.getProduct(o.product)
        if (p && p.stock >= 0 && p.stock < o.qty) return ctx.reply(`Stok ${p.name} tinggal ${p.stock}, tidak cukup untuk order ini.`)
        const { inv } = await AP.create('order', { buyer: o.buyer, chat: from, amount: o.price * o.qty, title: `${o.name} x${o.qty} (${o.id})`, meta: { orderId: o.id } })
        return AP.sendInvoice(ctx, inv)
      }

      // ---------- topup saldo bot ----------
      if (command === 'topup' || command === 'isisaldo') {
        if (need()) return
        const c = ao.cfg()
        const min = Math.max(300, Number(c.minTopup) || 1000)
        const max = Math.min(10000000, Number(c.maxTopup) || 1000000)
        const rate = Number(c.topupRate) || 1
        const amount = parseAmount(args[0])
        if (!amount) {
          const body = ['*TOPUP SALDO*', '', 'Isi saldo bot lewat QRIS, otomatis masuk setelah dibayar.', '', rows([['Kurs', `Rp1 = ${num(rate)} saldo`], ['Minimal', rp(min)], ['Maksimal', rp(max)], ['Saldo kini', num(db.getUser(sender).money)]]), '', `Contoh: ${prefix}topup 10000  atau  ${prefix}topup 10k`].join('\n')
          const quick = [min, 10000, 20000, 50000].filter((v, i, a) => v >= min && v <= max && a.indexOf(v) === i).slice(0, 4)
          return card(ctx, { body, buttons: quick.map((v) => btn.reply(rp(v), `${prefix}topup ${v}`)), fallback: body })
        }
        if (amount < min) return ctx.reply(`Minimal topup ${rp(min)}.`)
        if (amount > max) return ctx.reply(`Maksimal topup ${rp(max)} sekali bayar.`)
        const money = Math.round(amount * rate)
        const { inv } = await AP.create('topup', { buyer: sender, chat: from, amount, title: `Topup saldo ${num(money)}`, meta: { money } })
        return AP.sendInvoice(ctx, inv)
      }

      // ---------- beli premium ----------
      if (command === 'premqris') {
        if (need()) return
        const plans = premiumPlans()
        if (!plans.length) return ctx.reply('Paket premium otomatis belum tersedia. Hubungi owner.')
        const days = parseInt(args[0], 10)
        const plan = plans.find((x) => x.days === days)
        if (!plan) {
          const body = ['*PREMIUM OTOMATIS*', '', 'Bayar lewat QRIS, premium aktif otomatis.', '', ...plans.map((x) => `- ${x.days} hari : ${rp(x.price)}`), '', `Contoh: ${prefix}premqris ${plans[0].days}`].join('\n')
          return card(ctx, { body, buttons: plans.slice(0, 4).map((x) => btn.reply(`${x.days} hari - ${rp(x.price)}`, `${prefix}premqris ${x.days}`)), fallback: body })
        }
        const { inv } = await AP.create('premium', { buyer: sender, chat: from, amount: plan.price, title: `Premium ${plan.days} hari`, meta: { days: plan.days } })
        return AP.sendInvoice(ctx, inv)
      }

      // ---------- status / batal / riwayat ----------
      if (command === 'statusbayar') {
        let inv = args[0] && AP.get(args[0])
        if (!inv) inv = AP.list((i) => AP.same(i.buyer, sender))[0]
        if (!inv) return ctx.reply(`Belum ada tagihan. Mulai dengan ${prefix}topup atau ${prefix}bayarqris <kode order>.`)
        if (!mine(inv)) return ctx.reply('Tagihan ini bukan milikmu.')
        if (ao.enabled()) await AP.check(inv, { force: true })
        if (inv.status === 'pending' && (args[1] || '').toLowerCase() === 'qr') return AP.sendInvoice(ctx, inv)
        const body = AP.invoiceBody(inv, { header: 'STATUS PEMBAYARAN', footer: inv.note ? `Catatan: ${inv.note}` : '' })
        const buttons = inv.status === 'pending' ? [btn.reply('Tampilkan QR', `${prefix}statusbayar ${inv.id} qr`), btn.reply('Batalkan', `${prefix}batalbayar ${inv.id}`)] : []
        return card(ctx, { body, buttons, fallback: body })
      }

      if (command === 'batalbayar') {
        const inv = AP.get(args[0])
        if (!inv) return ctx.reply(`Format: ${prefix}batalbayar <kode tagihan>\nLihat kode di ${prefix}riwayatbayar`)
        if (!mine(inv)) return ctx.reply('Tagihan ini bukan milikmu.')
        if (need()) return
        await AP.cancel(inv)
        return ctx.reply(`Tagihan ${inv.id} dibatalkan.`)
      }

      if (command === 'riwayatbayar') {
        const all = AP.list((i) => mine(i)).slice(0, 10)
        if (!all.length) return ctx.reply('Belum ada riwayat tagihan.')
        const body = ['*RIWAYAT TAGIHAN*', '', ...all.map((i) => `${i.id} | ${i.title} | ${rp(i.amount)} | ${String(i.status).toUpperCase()}${isOwner ? ' | @' + String(i.buyer).split('@')[0] : ''}`)].join('\n')
        const active = all.filter((i) => i.status === 'pending').slice(0, 3).map((i) => btn.reply(`Cek ${i.id}`, `${prefix}statusbayar ${i.id}`))
        return card(ctx, { body, buttons: active, fallback: body })
      }
    } catch (e) {
      return fail(e)
    }
  }
}
