// Pembayaran toko: .payment  .getpay [metode]  .setpay <metode> ...  .delpay <metode>
const shop = require('../../lib/shop')
const { card, rows, btn } = require('../../lib/shopui')
const { getMedia } = require('../../lib/utils')

const USAGE = (p) => [
  'Cara mengatur pembayaran (owner):',
  `${p}setpay qris        (kirim / balas foto QRIS, tulis perintah di caption)`,
  `${p}setpay dana 08123456789 | Nama Pemilik`,
  `${p}setpay ovo 08123456789 | Nama Pemilik`,
  `${p}setpay gopay 08123456789 | Nama Pemilik`,
  `${p}delpay <metode>    hapus satu metode`
].join('\n')

async function sendMethod(ctx, key) {
  const m = shop.METHODS[key]
  const data = shop.getPay(key)
  const { prefix } = ctx
  if (!data) return ctx.reply(`Metode ${m.label} belum diatur owner.`)
  const others = shop.listPay().filter((k) => k !== key)
  const nav = others.map((k) => btn.reply(shop.METHODS[k].label, `${prefix}getpay ${k}`))
  if (key === 'qris') {
    const img = shop.qrisBuffer()
    const body = ['*PEMBAYARAN QRIS*', '', 'Scan QR di atas lewat aplikasi bank / e-wallet apa pun.', data.note ? `Catatan : ${data.note}` : '', '', 'Kirim bukti transfer ke owner setelah membayar.'].filter((x) => x !== '').join('\n')
    return card(ctx, { image: img, body, buttons: nav, fallback: body })
  }
  const body = ['*PEMBAYARAN ' + m.label.toUpperCase() + '*', '', rows([['Nomor', data.number], ['A/N', data.name || '-']]), '', 'Kirim bukti transfer ke owner setelah membayar.'].join('\n')
  return card(ctx, { body, buttons: [btn.copy('Salin nomor', data.number), ...nav], fallback: body })
}

module.exports = {
  name: 'payment',
  command: ['payment', 'pay', 'getpay', 'setpay', 'delpay'],
  category: 'store',
  desc: 'Lihat / atur metode pembayaran toko (QRIS, DANA, OVO, GoPay)',
  usage: '<getpay [metode]> | <setpay metode data> (owner)',
  run: async (ctx) => {
    const { command, args, prefix, isOwner, sock, msg } = ctx
    const sub = (args[0] || '').toLowerCase()

    // ---- setpay / delpay (owner) ----
    if (command === 'setpay' || command === 'delpay') {
      if (!isOwner) return ctx.reply(ctx.config.mess.only.owner)
      const key = shop.method(sub)
      if (command === 'delpay') {
        if (!key) return ctx.reply(`Sebutkan metode: ${Object.keys(shop.METHODS).join(', ')}`)
        return ctx.reply(shop.delPay(key) ? `Metode ${shop.METHODS[key].label} dihapus.` : `Metode ${shop.METHODS[key].label} memang belum diatur.`)
      }
      if (!key) {
        const buttons = Object.keys(shop.METHODS).map((k) => btn.reply(shop.METHODS[k].label, `${prefix}setpay ${k}`))
        return card(ctx, { body: ['*SETPAY*', '', 'Pilih metode yang mau diatur.', '', USAGE(prefix)].join('\n'), buttons, fallback: USAGE(prefix) })
      }
      if (key === 'qris') {
        const media = await getMedia(sock, msg, ['imageMessage']).catch(() => null)
        if (!media) return ctx.reply(`Kirim atau balas foto QRIS dengan caption ${prefix}setpay qris [catatan]`)
        shop.setQris(media.buffer, args.slice(1).join(' '))
        return card(ctx, { image: media.buffer, body: '*QRIS tersimpan.*\nLihat hasilnya dengan tombol di bawah.', buttons: [btn.reply('Lihat QRIS', `${prefix}getpay qris`), btn.reply('Semua metode', `${prefix}payment`)], fallback: `QRIS tersimpan. Cek: ${prefix}getpay qris` })
      }
      const raw = args.slice(1).join(' ')
      const [num, ...nm] = raw.split('|')
      const number = (num || '').replace(/[^\d]/g, '')
      if (number.length < 8 || number.length > 16) return ctx.reply(`Format: ${prefix}setpay ${key} 08123456789 | Nama Pemilik`)
      const d = shop.setNumber(key, number, nm.join('|'))
      const body = ['*' + shop.METHODS[key].label + ' tersimpan*', '', rows([['Nomor', d.number], ['A/N', d.name || '-']])].join('\n')
      return card(ctx, { body, buttons: [btn.reply('Lihat', `${prefix}getpay ${key}`), btn.reply('Semua metode', `${prefix}payment`)], fallback: body })
    }

    // ---- getpay / payment / pay ----
    const list = shop.listPay()
    if (!list.length) return ctx.reply('Belum ada metode pembayaran.' + (isOwner ? `\n\n${USAGE(prefix)}` : '\nHubungi owner.'))
    const key = shop.method(sub)
    if (key) return sendMethod(ctx, key)
    const body = ['*METODE PEMBAYARAN*', '', ...list.map((k) => `- ${shop.METHODS[k].label}`), '', 'Pilih salah satu untuk melihat detailnya.'].join('\n')
    const buttons = [
      btn.list('Pilih metode', [{ title: 'METODE TERSEDIA', rows: list.map((k) => ({ header: '', title: shop.METHODS[k].label, description: k === 'qris' ? 'Scan kode QR' : `Nomor ${shop.getPay(k).number}`, id: `${prefix}getpay ${k}` })) }]),
      ...list.slice(0, 3).map((k) => btn.reply(shop.METHODS[k].label, `${prefix}getpay ${k}`))
    ]
    const fallback = body + '\n\n' + list.map((k) => `${prefix}getpay ${k}`).join('\n')
    return card(ctx, { body, buttons, fallback })
  }
}
