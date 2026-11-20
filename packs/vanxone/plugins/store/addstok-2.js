// Fitur store_autoorder/addstok — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store_autoorder/addstok", {
  "name": "autoaddstok",
  "command": [
    "autoaddstok",
    "autotambahstok"
  ],
  "category": "store",
  "desc": "📦 Menambah stok digital ke produk",
  "usage": ".autoaddstok <id_produk/nomor> | <data_stok>",
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
