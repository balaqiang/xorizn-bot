// Fitur religi/tahlil — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("religi/tahlil", {
  "name": "tahlil",
  "command": [
    "tahlil",
    "tahlilan",
    "doatahlil"
  ],
  "category": "islam",
  "desc": "Panduan Tahlil Lengkap (Doa, Bacaan, dan Tata Cara)",
  "usage": ".tahlil",
  "owner": false,
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
