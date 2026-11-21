// Auto beli panel (QRIS otomatis) — mesin ada di lib/autopanel.js
//   .produkpanel                               daftar produk panel
//   .belipanel <id> <user> <password> <email>  buat order + QRIS, bayar terpantau otomatis, data panel dikirim sendiri
//   .cekpay <invoice>                          cek status pembayaran
//   .detailpanel <invoice>                     detail order (data login panel)
//   .garansipanel                              link garansi
//   .cekserver <serverId> [panelUrl]           cek server panel
//   .renewpanel <serverId> [panelUrl]          buat perpanjangan + pantau pembayaran
//   .cekrenew <TRX-RENEW-xxx>                  cek pembayaran perpanjangan
//   .orderspanel                               daftar semua order (owner)
const AP = require('../../lib/autopanel')

module.exports = {
  name: 'autopanel',
  command: AP.NAMES,
  category: 'panel',
  desc: 'Auto beli panel (QRIS otomatis, cek bayar & kirim data panel otomatis)',
  usage: '.produkpanel | .belipanel <id> <user> <pass> <email> | .cekpay <inv> | .detailpanel <inv> | .renewpanel <serverId>',
  run: (ctx) => AP.handle(ctx)
}
