// Fitur search/migen — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("search/migen", {
  "name": "meigen",
  "command": [
    "meigen",
    "meigens"
  ],
  "category": "search",
  "desc": "Cari prompt dari Meigen AI",
  "usage": ".meigen <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
