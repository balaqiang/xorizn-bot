// Fitur anime/anilist — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("anime/anilist", {
  "name": "anilist",
  "command": [
    "anilist"
  ],
  "category": "anime",
  "desc": "",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
