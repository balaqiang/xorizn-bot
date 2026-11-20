// Fitur search/movieku — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/movieku", {
  "name": "movieku",
  "command": [
    "movieku",
    "carifilm",
    "carimovie"
  ],
  "category": "search",
  "desc": "Cari dan tampilkan informasi film lengkap dari Movieku beserta link download dalam berbagai kualitas",
  "usage": ".movieku <judul film>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
