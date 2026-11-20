// Fitur search/mangaread — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("search/mangaread", {
  "name": "mangaread",
  "command": [
    "mangaread",
    "mread",
    "readmanga",
    "bacamanga"
  ],
  "category": "search",
  "desc": "Membaca manga dari Shinigami",
  "usage": ".mangaread <url atau id>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 5,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
