// Fitur store/liststok — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store/liststok", {
  "name": "liststok",
  "command": [
    "liststok",
    "liststock",
    "stok",
    "stock"
  ],
  "category": "store",
  "desc": "📋 Lihat daftar stok item produk",
  "usage": ".liststok <nomor_produk>",
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
