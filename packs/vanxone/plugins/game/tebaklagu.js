// Fitur game/tebaklagu — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("game/tebaklagu", {
  "name": "tebaklagu",
  "command": [
    "tl",
    "guesssong"
  ],
  "category": "game",
  "desc": "Tebak judul lagu dari potongan lirik",
  "usage": ".tebaklagu",
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
