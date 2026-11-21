// Fitur game/tebakmakanan — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("game/tebakmakanan", {
  "name": "tebakmakanan",
  "command": [
    "tebakmakanan",
    "makanan",
    "food"
  ],
  "category": "game",
  "desc": "Tebak nama makanan khas Indonesia dari gambar",
  "usage": ".tebakmakanan",
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
