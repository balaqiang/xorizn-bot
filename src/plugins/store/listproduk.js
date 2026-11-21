// Fitur store_autoorder/listproduk — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store_autoorder/listproduk", {
  "name": "autolistproduk",
  "command": [
    "autolistproduk",
    "autoproduk",
    "autostore"
  ],
  "category": "store",
  "desc": "🛍️ Menampilkan daftar produk autoorder",
  "usage": ".autolistproduk",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
