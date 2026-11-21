// Fitur tools/struk — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/struk", {
  "name": "struk",
  "command": [
    "struk",
    "printstruk",
    "buatstruk",
    "pdfstruk"
  ],
  "category": "tools",
  "desc": "Membuat struk belanja simpel (Nama Store, No Telp, Produk, Jumlah, Harga, Tanggal)",
  "usage": ".struk <Nama Store> | <No Telp> | <Produk> | <Jumlah> | <Harga>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
