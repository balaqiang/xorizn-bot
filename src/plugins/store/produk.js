// Toko: .addproduk .delproduk .editproduk .produk .beli .sudahbayar .terima .tolak .listorder
const shop = require('../../lib/shop')
const owners = require('../../lib/owners')
const { card, rows, jidOf, btn } = require('../../lib/shopui')
const { getMedia, userOf } = require('../../lib/utils')

const cut = (s, n) => (String(s).length > n ? String(s).slice(0, n - 1) + '…' : String(s))
const ADD_USAGE = (p) => [
  '*ADD PRODUK* (owner)',
  '',
  `${p}addproduk Nama | Harga | Deskripsi | Stok | Isi pesanan`,
  '',
  '- Harga: angka, contoh 15000',
  '- Stok: angka, atau - untuk tanpa batas (boleh dikosongkan)',
  '- Isi pesanan: data yang otomatis dikirim ke pembeli setelah pembayaran diterima (akun, link, dll). Boleh dikosongkan',
  '- Foto produk: kirim foto dengan caption perintah ini, atau balas sebuah foto',
  '',
  `Contoh:\n${p}addproduk Netflix 1 Bulan | 25000 | Akun sharing 1 profil | 10 | email:xx pass:yy`
].join('\n')

const productBody = (p) => [
  `*${p.name.toUpperCase()}*`,
  '',
  rows([['ID', p.id], ['Harga', shop.rupiah(p.price)], ['Stok', shop.stockText(p)], ['Terjual', p.sold]]),
  p.desc ? `\n${p.desc}` : ''
].join('\n')

async function detail(ctx, p) {
  const { prefix } = ctx
  const body = productBody(p)
  const buttons = p.stock === 0 ? [btn.reply('Lihat produk lain', `${prefix}produk`)] : [btn.reply('Beli sekarang', `${prefix}beli ${p.id}`), btn.reply('Produk lain', `${prefix}produk`)]
  return card(ctx, { image: shop.productImage(p), body, buttons, fallback: body + (p.stock === 0 ? '' : `\n\nBeli: ${prefix}beli ${p.id}`) })
}

function invoiceBody(o) {
  return [
    '*INVOICE*',
    '',
    rows([['Order', o.id], ['Produk', o.name], ['Jumlah', o.qty], ['Harga', shop.rupiah(o.price * o.qty)], ['Kode unik', o.unique], ['Total', shop.rupiah(o.total)], ['Status', o.status.toUpperCase()]])
  ].join('\n')
}

async function notifyOwners(ctx, text, buttons) {
  const list = owners.fixed()
  for (const n of list) {
    try { await card(ctx, { to: jidOf(n), body: text, buttons, fallback: text }) } catch (e) { console.log('[STORE] gagal notif owner', n, e.message) }
  }
}

module.exports = {
  name: 'produk',
  command: ['addproduk', 'delproduk', 'editproduk', 'produk', 'listproduk', 'store', 'toko', 'beli', 'sudahbayar', 'terima', 'tolak', 'listorder'],
  category: 'store',
  desc: 'Toko: tambah produk, katalog, beli, konfirmasi pembayaran',
  usage: '<addproduk | produk | beli id>',
  run: async (ctx) => {
    const { command, args, text, prefix, isOwner, sock, msg, sender, from } = ctx
    const needOwner = () => ctx.reply(ctx.config.mess.only.owner)

    // ---------- owner: tambah / hapus / edit ----------
    if (command === 'addproduk') {
      if (!isOwner) return needOwner()
      if (!text) return card(ctx, { body: ADD_USAGE(prefix), buttons: [], fallback: ADD_USAGE(prefix) })
      const [name, price, desc = '', stock = '', ...rest] = text.split('|').map((s) => s.trim())
      const priceN = Number(String(price || '').replace(/[^\d]/g, ''))
      if (!name || !priceN) return ctx.reply('Nama dan harga wajib diisi.\n\n' + ADD_USAGE(prefix))
      const stockN = stock === '' || stock === '-' ? -1 : Number(stock.replace(/[^\d]/g, ''))
      const media = await getMedia(sock, msg, ['imageMessage']).catch(() => null)
      const p = shop.addProduct({ name, price: priceN, desc, stock: Number.isFinite(stockN) ? stockN : -1, content: rest.join('|'), image: media?.buffer })
      const body = '*Produk ditambahkan*\n\n' + productBody(p) + (p.content ? '\n\nIsi pesanan tersimpan (dikirim otomatis saat order diterima).' : '')
      return card(ctx, { image: media?.buffer, body, buttons: [btn.reply('Lihat katalog', `${prefix}produk`), btn.reply('Tambah lagi', `${prefix}addproduk`)], fallback: body })
    }
    if (command === 'delproduk') {
      if (!isOwner) return needOwner()
      const p = shop.getProduct(args[0])
      if (!p) return ctx.reply(`Produk tidak ditemukan. Lihat ID di ${prefix}produk`)
      shop.delProduct(p.id)
      return ctx.reply(`Produk "${p.name}" (ID ${p.id}) dihapus.`)
    }
    if (command === 'editproduk') {
      if (!isOwner) return needOwner()
      const p = shop.getProduct(args[0])
      const field = (args[1] || '').toLowerCase()
      const val = args.slice(2).join(' ')
      if (!p || !field || !val) return ctx.reply([`Format: ${prefix}editproduk <id> <nama|harga|desc|stok|isi> <nilai>`, `Contoh: ${prefix}editproduk 1 harga 20000`].join('\n'))
      if (field === 'nama' || field === 'name') p.name = shop.clean(val)
      else if (field === 'harga' || field === 'price') p.price = Number(val.replace(/[^\d]/g, '')) || p.price
      else if (field === 'desc' || field === 'deskripsi') p.desc = val
      else if (field === 'stok' || field === 'stock') p.stock = val === '-' ? -1 : Number(val.replace(/[^\d]/g, '')) || 0
      else if (field === 'isi' || field === 'content') p.content = val
      else return ctx.reply('Kolom tidak dikenal. Pilih: nama, harga, desc, stok, isi.')
      shop.st.save()
      return detail(ctx, p)
    }

    // ---------- katalog ----------
    if (command === 'produk' || command === 'listproduk' || command === 'store' || command === 'toko') {
      const one = args[0] && shop.getProduct(args[0])
      if (one) return detail(ctx, one)
      const all = shop.listProducts()
      if (!all.length) return ctx.reply('Belum ada produk.' + (isOwner ? `\nTambah dengan ${prefix}addproduk` : ''))
      const body = ['*KATALOG PRODUK*', '', ...all.map((p) => `${p.id}. ${p.name} - ${shop.rupiah(p.price)} (${shop.stockText(p)})`), '', 'Pilih produk untuk melihat detail dan membeli.'].join('\n')
      const rowsList = all.slice(0, 50).map((p) => ({ header: '', title: cut(p.name, 24), description: cut(`${shop.rupiah(p.price)} | stok ${shop.stockText(p)}`, 72), id: `${prefix}produk ${p.id}` }))
      const buttons = [btn.list('Pilih produk', [{ title: 'PRODUK', rows: rowsList }]), btn.reply('Metode bayar', `${prefix}payment`)]
      return card(ctx, { body, buttons, fallback: body + `\n\nDetail: ${prefix}produk <id>\nBeli: ${prefix}beli <id>` })
    }

    // ---------- pembeli ----------
    if (command === 'beli') {
      const p = shop.getProduct(args[0])
      if (!p) return ctx.reply(`Format: ${prefix}beli <id> [jumlah]\nLihat ID di ${prefix}produk`)
      const qty = Math.max(1, Math.min(50, parseInt(args[1], 10) || 1))
      if (p.stock >= 0 && p.stock < qty) return ctx.reply(`Stok ${p.name} tinggal ${p.stock}.`)
      const auto = require('../../lib/autoorder').enabled() && p.price * qty >= 300
      if (!auto && !shop.listPay().length) return ctx.reply('Owner belum mengatur metode pembayaran. Coba lagi nanti.')
      const o = shop.createOrder({ buyer: sender, chat: from, product: p, qty })
      let body = invoiceBody(o)
      if (auto) {
        body += `\n\n*QRIS otomatis*: bayar ${shop.rupiah(o.price * o.qty)} lewat tombol di bawah, pesanan langsung terkirim tanpa menunggu konfirmasi owner (tanpa kode unik).`
        if (shop.listPay().length) body += '\nAtau bayar manual sesuai TOTAL (termasuk kode unik), lalu tekan "Sudah bayar".'
      } else body += '\n\nBayar sesuai TOTAL (termasuk kode unik), lalu tekan "Sudah bayar".'
      const buttons = [
        ...(auto ? [btn.reply('Bayar QRIS otomatis', `${prefix}bayarqris ${o.id}`)] : []),
        ...shop.listPay().map((k) => btn.reply('Bayar ' + shop.METHODS[k].label, `${prefix}getpay ${k}`)),
        ...(shop.listPay().length ? [btn.reply('Sudah bayar', `${prefix}sudahbayar ${o.id}`)] : [])
      ]
      return card(ctx, { body, buttons, fallback: body + (auto ? `\n\nQRIS otomatis: ${prefix}bayarqris ${o.id}` : '') + (shop.listPay().length ? `\n\nMetode: ${prefix}payment\nKonfirmasi: ${prefix}sudahbayar ${o.id}` : '') })
    }
    if (command === 'sudahbayar') {
      const o = shop.getOrder(args[0])
      if (!o) return ctx.reply(`Order tidak ditemukan. Format: ${prefix}sudahbayar <kode order>`)
      if (!isOwner && userOf(o.buyer) !== userOf(sender)) return ctx.reply('Order ini bukan milikmu.')
      if (o.status === 'done') return ctx.reply('Order ini sudah selesai.')
      if (o.status === 'rejected') return ctx.reply('Order ini sudah ditolak.')
      o.status = 'paid'
      shop.st.save()
      await ctx.reply(`Konfirmasi diterima. Order ${o.id} sedang dicek owner, mohon tunggu. Kirim bukti transfer ke owner bila diminta.`)
      const body = ['*PEMBAYARAN MASUK*', '', invoiceBody(o), '', `Pembeli : @${userOf(o.buyer)}`].join('\n')
      return notifyOwners(ctx, body, [btn.reply('Terima', `${prefix}terima ${o.id}`), btn.reply('Tolak', `${prefix}tolak ${o.id}`)])
    }

    // ---------- owner: proses order ----------
    if (command === 'terima' || command === 'tolak' || command === 'listorder') {
      if (!isOwner) return needOwner()
      if (command === 'listorder') {
        const status = (args[0] || '').toLowerCase()
        const list = shop.listOrders(['pending', 'paid', 'done', 'rejected'].includes(status) ? status : '').slice(0, 20)
        if (!list.length) return ctx.reply('Belum ada order.')
        const body = ['*DAFTAR ORDER*', '', ...list.map((o) => `${o.id} | ${o.name} x${o.qty} | ${shop.rupiah(o.total)} | ${o.status}`)].join('\n')
        const paid = list.filter((o) => o.status === 'paid').slice(0, 3).map((o) => btn.reply('Terima ' + o.id, `${prefix}terima ${o.id}`))
        return card(ctx, { body, buttons: paid, fallback: body })
      }
      const o = shop.getOrder(args[0])
      if (!o) return ctx.reply(`Order tidak ditemukan. Format: ${prefix}${command} <kode order>`)
      if (o.status === 'done' || o.status === 'rejected') return ctx.reply(`Order ${o.id} sudah ${o.status === 'done' ? 'selesai' : 'ditolak'}.`)
      const buyerJid = o.buyer
      if (command === 'tolak') {
        o.status = 'rejected'
        shop.st.save()
        const why = args.slice(1).join(' ')
        await sock.sendMessage(buyerJid, { text: `Order ${o.id} (${o.name}) ditolak owner.${why ? `\nAlasan: ${why}` : ''}\nHubungi owner bila ada kekeliruan.` }).catch(() => {})
        return ctx.reply(`Order ${o.id} ditolak.`)
      }
      const p = shop.getProduct(o.product)
      if (p && p.stock >= 0) {
        if (p.stock < o.qty) return ctx.reply(`Stok ${p.name} kurang (${p.stock}), tidak bisa menyelesaikan order.`)
        p.stock -= o.qty
      }
      if (p) p.sold += o.qty
      o.status = 'done'
      shop.st.save()
      const out = ['*PEMBAYARAN DITERIMA*', '', rows([['Order', o.id], ['Produk', o.name], ['Jumlah', o.qty], ['Total', shop.rupiah(o.total)]]), '', p && p.content ? 'Data pesananmu dikirim di pesan berikutnya.' : 'Pesanan akan diproses owner secepatnya.', '', 'Terima kasih sudah berbelanja.'].join('\n')
      await card(ctx, { to: buyerJid, body: out, buttons: p && p.content ? [btn.copy('Salin pesanan', p.content.slice(0, 1000))] : [], fallback: out }).catch((e) => ctx.reply('Gagal kirim ke pembeli: ' + e.message))
      // isi pesanan dikirim mentah (tanpa pemformat gaya bot) supaya akun/link/password tidak berubah bentuk
      if (p && p.content) await (sock.__rawSend || sock.sendMessage)(buyerJid, { text: p.content }).catch(() => {})
      return ctx.reply(`Order ${o.id} selesai${p && p.content ? ' dan isi pesanan sudah dikirim ke pembeli.' : '. Produk ini tidak punya isi otomatis, kirim manual ke pembeli.'}`)
    }
  }
}
