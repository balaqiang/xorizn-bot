// Fitur search/pins — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("search/pins", {
  "name": "pins",
  "command": [
    "pins",
    "pinsearch",
    "pinterestsearch"
  ],
  "category": "search",
  "desc": "Cari gambar di Pinterest (album)",
  "usage": ".pins <query>",
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
