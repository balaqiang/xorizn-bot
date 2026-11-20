// Fitur anime/waifu_anime — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("anime/waifu_anime", {
  "name": "waifu_anime",
  "command": [
    "anime-waifu",
    "waifu-anime",
    "randomwaifu",
    "waifurandom",
    "waifupic"
  ],
  "category": "anime",
  "desc": "Random gambar waifu dari berbagai sumber",
  "usage": ".waifu",
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
