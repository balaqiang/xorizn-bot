// Fitur store_autoorder/beli — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store_autoorder/beli", {
  "name": "autobeli",
  "command": [
    "autobeli",
    "autoorder",
    "autobuy"
  ],
  "category": "store",
  "desc": "🛒 Membeli produk autoorder secara otomatis pakai saldo",
  "usage": ".autobeli <nomor/id_produk>",
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
