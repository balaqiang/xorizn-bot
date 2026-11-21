// Fitur fun/renungan — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("fun/renungan", {
  "name": "renungan",
  "command": [
    "renungan",
    "mutiara"
  ],
  "category": "fun",
  "desc": "Random gambar renungan/motivasi",
  "usage": ".renungan",
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
