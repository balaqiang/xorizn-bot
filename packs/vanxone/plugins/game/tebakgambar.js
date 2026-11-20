// Fitur game/tebakgambar — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("game/tebakgambar", {
  "name": "tebakgambar",
  "command": [
    "guessimage"
  ],
  "category": "game",
  "desc": "Tebak kata dari gambar",
  "usage": ".tebakgambar",
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
