// Nomor virtual OTP (Nokos) lewat AutoOrder: .nokos .nokosharga .nokosbeli .nokoscek .nokosbatal .nokosriwayat
// Pembeli bayar pakai saldo bot (isi lewat .topup). Mesin & pemantau di lib/aonokos.js.
const ao = require('../../lib/autoorder')
const NK = require('../../lib/aonokos')
const db = require('../../lib/db')
const { card, rows, btn } = require('../../lib/shopui')

const cut = (s, n) => (String(s).length > n ? String(s).slice(0, n - 1) + '…' : String(s))
const num = NK.num
const TIERS = ['economy', 'standard']

// argumen bebas: tier (economy|standard), negara, atau offer=<id>
function parseOpts(args) {
  const o = {}
  for (const a of args) {
    const t = String(a).toLowerCase()
    if (TIERS.includes(t)) o.tier = t
    else if (t.startsWith('offer=')) o.offerId = String(a).slice(6)
    else if (!o.country) o.country = t
  }
  return o
}

module.exports = {
  name: 'aonokos',
  command: ['nokos', 'nokosharga', 'nokosbeli', 'nokoscek', 'nokosbatal', 'nokosriwayat'],
  category: 'store',
  desc: 'Beli nomor virtual untuk OTP (pakai saldo bot)',
  usage: '<nokos [cari]> | <nokosharga id> | <nokosbeli id [tier] [negara]> | <nokoscek> | <nokosbatal order>',
  run: async (ctx) => {
    const { command, args, prefix, isOwner, sock, sender, from } = ctx
    NK.attach(sock)
    NK.start()
    const fail = (e) => {
      if (e && e.user) return ctx.reply(e.message)
      console.log('[NOKOS]', command, e && e.message)
      if (e && e.code === 'NO_KEY') return ctx.reply(isOwner ? e.message : 'Fitur nomor virtual belum diaktifkan owner.')
      return ctx.reply(`Gagal: ${e && e.message ? e.message : 'kesalahan tidak dikenal'}.\nCoba lagi sebentar lagi, atau hubungi owner.`)
    }
    if (!NK.enabled()) return ctx.reply(isOwner ? 'Nokos mati: isi global.autoorder.apiKey dan pastikan global.autoorder.nokos tidak false di settings.js.' : 'Fitur nomor virtual belum diaktifkan owner.')
    const mine = (o) => isOwner || NK.same(o.buyer, sender)

    try {
      // ---------- daftar layanan ----------
      if (command === 'nokos') {
        const q = args.join(' ').toLowerCase()
        const all = (await ao.nokosServices()) || []
        const found = all.filter((s) => !q || `${s.name} ${s.category || ''} ${s.id}`.toLowerCase().includes(q))
        if (!found.length) return ctx.reply(q ? `Layanan "${q}" tidak ditemukan. Coba ${prefix}nokos untuk semua layanan.` : 'Belum ada layanan tersedia.')
        const shown = found.slice(0, 50)
        const body = ['*NOMOR VIRTUAL (OTP)*', '', 'Pilih layanan untuk melihat harga per negara. Bayar pakai saldo bot.', '', ...shown.slice(0, 25).map((s) => `- ${s.name} (mulai ${num(NK.sellPrice(s.startingPrice).money)} saldo) | id: ${s.id}`), found.length > 25 ? `\n...dan ${found.length - 25} lainnya, pakai ${prefix}nokos <nama>.` : '', '', `Saldo kamu: ${num(db.getUser(sender).money)} (isi: ${prefix}topup)`].join('\n')
        const rowsList = shown.map((s) => ({ header: s.category || '', title: cut(s.name, 24), description: cut(`mulai ${num(NK.sellPrice(s.startingPrice).money)} saldo`, 72), id: `${prefix}nokosharga ${s.id}` }))
        return card(ctx, { body, buttons: [btn.list('Pilih layanan', [{ title: 'LAYANAN', rows: rowsList }]), btn.reply('Topup saldo', `${prefix}topup`)], fallback: body + `\n\nHarga: ${prefix}nokosharga <id>` })
      }

      // ---------- harga per negara ----------
      if (command === 'nokosharga') {
        const id = args[0]
        if (!id) return ctx.reply(`Format: ${prefix}nokosharga <id layanan> [economy|standard] [negara]\nLihat id di ${prefix}nokos`)
        const o = parseOpts(args.slice(1))
        const offers = (await ao.nokosOffers(id, o)) || []
        if (!offers.length) return ctx.reply('Tidak ada penawaran untuk pilihan itu.')
        const sorted = offers.slice().sort((a, b) => Number(a.price) - Number(b.price)).slice(0, 50)
        const body = ['*HARGA NOMOR VIRTUAL*', '', ...sorted.slice(0, 20).map((x) => `- ${x.countryName} | ${x.tierLabel || x.tier} | ${num(NK.sellPrice(x.price).money)} saldo | stok ${x.available ?? '?'}${x.note ? ' | ' + x.note : ''}`), sorted.length > 20 ? `\n...dan ${sorted.length - 20} lainnya (pakai daftar tombol).` : '', '', `Beli termurah: ${prefix}nokosbeli ${id} [economy|standard] [negara]`].join('\n')
        const rowsList = sorted.map((x) => ({ header: x.tierLabel || x.tier || '', title: cut(x.countryName, 24), description: cut(`${num(NK.sellPrice(x.price).money)} saldo | stok ${x.available ?? '?'}`, 72), id: `${prefix}nokosbeli ${id} offer=${x.id}` }))
        return card(ctx, { body, buttons: [btn.list('Pilih & beli', [{ title: 'PENAWARAN', rows: rowsList }])], fallback: body })
      }

      // ---------- beli ----------
      if (command === 'nokosbeli') {
        const id = args[0]
        if (!id) return ctx.reply(`Format: ${prefix}nokosbeli <id layanan> [economy|standard] [negara]\nContoh: ${prefix}nokosbeli whatsapp economy indonesia`)
        if (!isOwner && NK.list((o) => o.status === 'pending' && NK.same(o.buyer, sender)).length >= 3) return ctx.reply('Kamu masih punya 3 pesanan nomor yang menunggu OTP. Selesaikan atau batalkan dulu.')
        const o = await NK.buy({ buyer: sender, chat: from, productId: id, free: isOwner, ...parseOpts(args.slice(1)) })
        const body = NK.orderBody(o, 'NOMOR DIPESAN') + '\n\nPakai nomor di atas untuk minta OTP, lalu tunggu. Kode dikirim otomatis ke chat ini begitu masuk.'
        return card(ctx, { body, buttons: [btn.copy('Salin nomor', o.phone || o.raw || ''), btn.reply('Cek status', `${prefix}nokoscek ${o.orderId}`), btn.reply('Batalkan', `${prefix}nokosbatal ${o.orderId}`)], fallback: body + `\n\nCek: ${prefix}nokoscek ${o.orderId}\nBatal: ${prefix}nokosbatal ${o.orderId}` })
      }

      // ---------- cek / batal / riwayat ----------
      if (command === 'nokoscek') {
        const o = args[0] ? NK.get(args[0]) : NK.list((x) => NK.same(x.buyer, sender))[0]
        if (!o) return ctx.reply(`Pesanan tidak ditemukan. Lihat ${prefix}nokosriwayat`)
        if (!mine(o)) return ctx.reply('Pesanan ini bukan milikmu.')
        await NK.check(o)
        const body = NK.orderBody(o, 'STATUS NOMOR') + (o.otp ? `\n\nKode OTP: ${o.otp}` : '')
        return card(ctx, { body, buttons: o.status === 'pending' ? [btn.reply('Cek lagi', `${prefix}nokoscek ${o.orderId}`), btn.reply('Batalkan', `${prefix}nokosbatal ${o.orderId}`)] : o.otp ? [btn.copy('Salin OTP', o.otp)] : [], fallback: body })
      }
      if (command === 'nokosbatal') {
        const o = NK.get(args[0])
        if (!o) return ctx.reply(`Format: ${prefix}nokosbatal <kode order>`)
        if (!mine(o)) return ctx.reply('Pesanan ini bukan milikmu.')
        await NK.cancel(o)
        return ctx.reply(`Pesanan ${o.orderId} dibatalkan.${o.charged ? ` Saldo ${num(o.charged)} dikembalikan.` : ''}`)
      }
      if (command === 'nokosriwayat') {
        const all = NK.list(mine).slice(0, 10)
        if (!all.length) return ctx.reply('Belum ada pesanan nomor.')
        const body = ['*RIWAYAT NOMOR VIRTUAL*', '', ...all.map((o) => `${o.orderId} | ${o.service} | ${o.country} | ${o.phone || '-'} | ${String(o.status).toUpperCase()}${isOwner ? ' | @' + String(o.buyer).split('@')[0] : ''}`)].join('\n')
        return card(ctx, { body, buttons: all.filter((o) => o.status === 'pending').slice(0, 3).map((o) => btn.reply(`Cek ${o.orderId}`, `${prefix}nokoscek ${o.orderId}`)), fallback: body })
      }
    } catch (e) {
      return fail(e)
    }
  }
}
