// Fitur music/playzero — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("music/playzero", {
  "name": "play-zero",
  "command": [
    "play-zero",
    "playzero",
    "pz",
    "lagu"
  ],
  "category": "audio",
  "desc": "Download & putar audio dari YouTube langsung (tanpa API)",
  "usage": ".play-zero <judul lagu>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
