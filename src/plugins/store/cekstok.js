// Fitur store_autoorder/cekstok — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store_autoorder/cekstok", {
  "name": "autocekstok",
  "command": [
    "autocekstok",
    "autoliststok",
    "autostok"
  ],
  "category": "store",
  "desc": "📦 Melihat daftar stok digital suatu produk",
  "usage": ".autocekstok <id_produk/nomor>",
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
