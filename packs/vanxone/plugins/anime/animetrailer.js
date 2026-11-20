// Fitur anime/animetrailer — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("anime/animetrailer", {
  "name": "animetrailer",
  "command": [
    "animetrailer",
    "traileranime",
    "animepv",
    "animepromo"
  ],
  "category": "anime",
  "desc": "Cari dan share trailer / PV anime terbaru dari YouTube",
  "usage": ".animetrailer <judul anime>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 8,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
