// Fitur anime/rekomanime — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("anime/rekomanime", {
  "name": "rekom-anime",
  "command": [
    "rekom-anime",
    "anime-rekom",
    "rekanime"
  ],
  "category": "anime",
  "desc": "Rekomendasi anime random",
  "usage": ".rekom-anime",
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
