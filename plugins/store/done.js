// Fitur store/done — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("store/done", {
  "name": "done",
  "command": [
    "done",
    "selesai",
    "kirim",
    "confirm"
  ],
  "category": "store",
  "desc": "✅ Konfirmasi transaksi toko atau beri limit harian unlimited permanen ke user",
  "usage": ".done <nomor_trx> atau reply pesan user lalu .done",
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
