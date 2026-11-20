// Fitur search/chords — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/chords", {
  "name": "chords",
  "command": [
    "chords",
    "chord",
    "kunci",
    "kuncigitar"
  ],
  "category": "search",
  "desc": "Cari chord/kunci gitar lagu",
  "usage": ".chords <judul lagu>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
})
