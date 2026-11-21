// Fitur download/spotifydl — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("download/spotifydl", {
  "name": "spotifydl",
  "command": [
    "spdl",
    "spotify-dl",
    "spotdl"
  ],
  "category": "downloader",
  "desc": "Unduh lagu favoritmu langsung dari Spotify tanpa ribet!",
  "usage": ".spdl <link>",
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
