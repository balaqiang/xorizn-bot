// Fitur game/tebakgame — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("game/tebakgame", {
  "name": "tebakgame",
  "command": [
    "tgame",
    "guessgame"
  ],
  "category": "game",
  "desc": "Tebak nama game dari gambar",
  "usage": ".tebakgame",
  "owner": false,
  "group": false,
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
