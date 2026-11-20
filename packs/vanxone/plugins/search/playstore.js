// Fitur search/playstore — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("search/playstore", {
  "name": "playstore",
  "command": [
    "ps"
  ],
  "category": "search",
  "desc": "Imported from Rimuru MD V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
