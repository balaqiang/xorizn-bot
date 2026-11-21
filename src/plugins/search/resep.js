// Fitur search/resep — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/resep", {
  "name": "resep",
  "command": [
    "resep",
    "resepmasak",
    "resepmasakan",
    "caramasak"
  ],
  "category": "search",
  "desc": "Cari resep makanan yang lengkap dan enak",
  "usage": ".resep <nama makanan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
})
