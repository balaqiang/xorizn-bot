// Fitur tools/spotifyvid — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/spotifyvid", {
  "name": "spotivid",
  "command": [
    "spotivid",
    "fakeplay",
    "spotifyvid"
  ],
  "category": "tools",
  "desc": "Mengubah Video menjadi UI Pemutar Lagu Spotify (Custom Title & Artist + Dynamic Scale)",
  "usage": ".spotivid Judul Lagu | Nama Artis",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
