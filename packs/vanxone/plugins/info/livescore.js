// Fitur info/livescore — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("info/livescore", {
  "name": "livescore",
  "command": [
    "livescore",
    "skorbola",
    "livebola",
    "skor"
  ],
  "category": "info",
  "desc": "Menampilkan live score pertandingan sepak bola dari Goal.com",
  "usage": ".livescore",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
