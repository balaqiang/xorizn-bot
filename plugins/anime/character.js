// Fitur anime/character — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("anime/character", {
  "name": "character",
  "command": [
    "character",
    "karakter",
    "animechar",
    "char"
  ],
  "category": "anime",
  "desc": "Cari profil karakter anime dari MyAnimeList",
  "usage": ".character <nama karakter>",
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
