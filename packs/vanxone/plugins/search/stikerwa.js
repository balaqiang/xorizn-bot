// Fitur search/stikerwa — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("search/stikerwa", {
  "name": "stikerwa",
  "command": [
    "stikerwa",
    "stickerwa",
    "wasearch",
    "wassticker",
    "stkrwa"
  ],
  "category": "search",
  "desc": "Cari sticker WhatsApp",
  "usage": ".stikerwa <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
