// Fitur anime/latest — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("anime/latest", {
  "name": "animelatest",
  "command": [
    "animelatest",
    "latestanime"
  ],
  "category": "anime",
  "desc": "",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
