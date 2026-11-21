// Fitur game/tebakanime — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("game/tebakanime", {
  "name": "tebakanime",
  "command": [
    "tebakanime",
    "tebaknime",
    "guessanime"
  ],
  "category": "game",
  "desc": "Tebak anime dari deskripsi (dapat limit)",
  "usage": ".tebakanime",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
