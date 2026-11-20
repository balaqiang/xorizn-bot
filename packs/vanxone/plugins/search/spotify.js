// Fitur search/spotify — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/spotify", {
  "name": "spotify",
  "command": [
    "spotifysearch",
    "spsearch"
  ],
  "category": "search",
  "desc": "Mencari daftar lagu di Spotify berdasarkan judul atau artis",
  "usage": ".spotify <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
