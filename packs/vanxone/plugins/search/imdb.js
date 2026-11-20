// Fitur search/imdb — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("search/imdb", {
  "name": "imdb",
  "command": [
    "imdb",
    "imdbinfo"
  ],
  "category": "search",
  "desc": "Cari detail film atau serial dari IMDb/OMDb",
  "usage": ".imdb <judul>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
