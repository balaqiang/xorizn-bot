// Fitur anime/animewall — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("anime/animewall", {
  "name": "animewall",
  "command": [
    "animewall",
    "animewallpaper",
    "wallanime",
    "wpanime"
  ],
  "category": "anime",
  "desc": "Dapatkan random wallpaper anime HD dari berbagai series",
  "usage": ".animewall [series]",
  "owner": false,
  "group": true,
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
