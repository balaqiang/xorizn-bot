// Fitur search/animeapaini — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/animeapaini", {
  "name": "animeapaini",
  "command": [
    "animeapaini",
    "whatanime",
    "animesearch",
    "sauceanime",
    "searchanime",
    "anime-checker",
    "animechecker"
  ],
  "category": "search",
  "desc": "Identifikasi judul anime dari gambar/screenshot",
  "usage": ".animeapaini (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
