// Fitur store_autoorder/hapusstok — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store_autoorder/hapusstok", {
  "name": "autohapusstok",
  "command": [
    "autohapusstok",
    "autodelstok"
  ],
  "category": "store",
  "desc": "📦 Menghapus stok digital tertentu dari produk",
  "usage": ".autohapusstok <id_produk/nomor> | <nomor_stok>",
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
