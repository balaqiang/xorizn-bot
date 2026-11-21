// Fitur search/melolo — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/melolo", {
  "name": "melolo",
  "command": [
    "melolo",
    "melolodrama",
    "dramamelolo"
  ],
  "category": "search",
  "desc": "Cari daftar drama pendek berdasarkan kategori dari Melolo",
  "usage": ".melolo <category>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 8,
  "energi": 1,
  "needs": {
    "apikeys": [
      "covenant"
    ],
    "scrapers": [],
    "assets": []
  }
})
