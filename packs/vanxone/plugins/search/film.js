// Fitur search/film — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/film", {
  "name": "film",
  "command": [
    "film",
    "movie",
    "nonton",
    "lk21"
  ],
  "category": "search",
  "desc": "Cari film dan nonton online",
  "usage": ".film <judul>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
})
