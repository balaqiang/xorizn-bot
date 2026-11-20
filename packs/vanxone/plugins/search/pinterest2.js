// Fitur search/pinterest2 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("search/pinterest2", {
  "name": "pins2",
  "command": [
    "pins2",
    "pinsearch2",
    "pinterestsearch2"
  ],
  "category": "search",
  "desc": "Cari gambar di Pinterest (Carousel/Swipe)",
  "usage": ".pins <query>",
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
