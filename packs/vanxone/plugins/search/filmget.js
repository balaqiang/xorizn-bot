// Fitur search/filmget — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/filmget", {
  "name": "filmget",
  "command": [
    "filmget",
    "getfilm",
    "filmdetail",
    "filminfo"
  ],
  "category": "search",
  "desc": "Ambil detail film",
  "usage": ".filmget <url>",
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
