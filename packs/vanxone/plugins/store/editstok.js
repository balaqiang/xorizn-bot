// Fitur store/editstok — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store/editstok", {
  "name": "editstok",
  "command": [
    "editstok",
    "editstock"
  ],
  "category": "store",
  "desc": "✏️ Edit stok item produk (hanya di private chat)",
  "usage": ".editstok <nomor_produk> <nomor_item>|<detail_baru>",
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
