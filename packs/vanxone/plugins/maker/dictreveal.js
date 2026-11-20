// Fitur maker/dictreveal — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("maker/dictreveal", {
  "name": "dictreveal",
  "command": [
    "dictreveal",
    "dictmeme",
    "defmeme",
    "kamusmeme",
    "wordreveal"
  ],
  "category": "maker",
  "desc": "Bikin meme dictionary ",
  "usage": ".dictreveal (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
