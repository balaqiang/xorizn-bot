// Fitur search/carianime — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("search/carianime", {
  "name": "carianime",
  "command": [
    "carianime"
  ],
  "category": "search",
  "desc": "Cari informasi lengkap anime",
  "usage": ".carianime <judul>",
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
