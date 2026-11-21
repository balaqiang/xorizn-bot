// Fitur store/productinfo — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store/productinfo", {
  "name": "productinfo",
  "command": [
    "productinfo",
    "infoproduk",
    "detailproduk"
  ],
  "category": "store",
  "desc": "Lihat detail produk",
  "usage": ".productinfo <nomor>",
  "owner": false,
  "group": true,
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
