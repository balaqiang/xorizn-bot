// Fitur search/infoloker — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("search/infoloker", {
  "name": "infoloker",
  "command": [
    "infoloker"
  ],
  "category": "search",
  "desc": "",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
