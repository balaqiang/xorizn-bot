// Fitur sticker/bratrb — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("sticker/bratrb", {
  "name": "bratrb",
  "command": [
    "bratrb",
    "bratremovebg",
    "bratrbtext"
  ],
  "category": "sticker",
  "desc": "Buat sticker teks transparan gaya brat",
  "usage": ".bratrb <teks>",
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
