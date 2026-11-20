// Fitur game/tebakkalimat — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("game/tebakkalimat", {
  "name": "tebakkalimat",
  "command": [
    "tebakkalimat",
    "tkl",
    "peribahasa"
  ],
  "category": "game",
  "desc": "Tebak kata yang hilang dari peribahasa",
  "usage": ".tebakkalimat",
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
