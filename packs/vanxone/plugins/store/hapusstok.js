// Fitur store/hapusstok — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store/hapusstok", {
  "name": "hapusstok",
  "command": [
    "hapusstok",
    "delstok",
    "delstock",
    "deletestok"
  ],
  "category": "store",
  "desc": "🗑️ Hapus stok item dari produk",
  "usage": ".hapusstok <nomor_produk> <nomor_item>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
