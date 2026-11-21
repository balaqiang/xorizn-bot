// Fitur store_autoorder/hapusproduk — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store_autoorder/hapusproduk", {
  "name": "autohapusproduk",
  "command": [
    "autohapusproduk",
    "autodelproduk"
  ],
  "category": "store",
  "desc": "🛍️ Menghapus produk dari autoorder store",
  "usage": ".autohapusproduk <id_produk/nomor>",
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
