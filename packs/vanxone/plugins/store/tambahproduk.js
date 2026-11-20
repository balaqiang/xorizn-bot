// Fitur store_autoorder/tambahproduk — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store_autoorder/tambahproduk", {
  "name": "autotambahproduk",
  "command": [
    "autotambahproduk",
    "autoaddproduk"
  ],
  "category": "store",
  "desc": "🛍️ Menambah produk ke autoorder store",
  "usage": ".autotambahproduk <nama> | <harga> | <deskripsi>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
