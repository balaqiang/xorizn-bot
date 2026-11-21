// Fitur anime/animedl — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("anime/animedl", {
  "name": "animedl",
  "command": [
    "animedl",
    "anime-download",
    "animedownload",
    "dlanime"
  ],
  "category": "anime",
  "desc": "Download anime batch/single episode dari Kusonime",
  "usage": ".animedl <judul | eps>",
  "owner": false,
  "group": false,
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
