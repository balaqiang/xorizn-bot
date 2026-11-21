// Fitur store/buy — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("store/buy", {
  "name": "beliproduk",
  "command": [
    "beliproduk",
    "buyproduk",
    "belisaldo",
    "buywithkoin",
    "ordersaldo"
  ],
  "category": "store",
  "desc": "Beli produk dengan saldo/koin",
  "usage": ".beliproduk [nomor_produk] [jumlah]",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
