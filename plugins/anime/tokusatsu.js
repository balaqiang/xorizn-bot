// Fitur anime/tokusatsu — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("anime/tokusatsu", {
  "name": "tokusatsu",
  "command": [
    "tokusatsu",
    "toku"
  ],
  "category": "anime",
  "desc": "Cari dan lihat data serial/episode tokusatsu dari TokusatsuIndo",
  "usage": ".tokusatsu <judul atau link>",
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
