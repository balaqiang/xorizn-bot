// Fitur store/addstok — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store/addstok", {
  "name": "addstok",
  "command": [
    "addstok",
    "addstock",
    "importstok",
    "importstock"
  ],
  "category": "store",
  "desc": "📦 Tambah stok item ke produk (hanya di private chat)",
  "usage": ".addstok <nomor_produk>|<detail> atau .addstok <nomor> <jumlah> (fisik)",
  "owner": true,
  "group": false,
  "private": true,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
