// Fitur info/gagwatch — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("info/gagwatch", {
  "name": "gag2watch",
  "command": [
    "gag2watch",
    "gag2-watch"
  ],
  "category": "info",
  "desc": "Cek informasi stok GAG2 Watch",
  "usage": ".gag2-watch",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
