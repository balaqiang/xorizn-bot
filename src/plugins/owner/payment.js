// Fitur owner/payment — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/payment", {
  "name": "payment",
  "command": [
    "qris"
  ],
  "category": "owner",
  "desc": "Menampilkan info payment",
  "usage": ".payment",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
