// Fitur main/tqto2 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("main/tqto2", {
  "name": "tqto2",
  "command": [
    "tqto2",
    "thanksto2",
    "credits2",
    "kredit2"
  ],
  "category": "info",
  "desc": "Menampilkan daftar kontributor bot",
  "usage": ".tqto2",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
