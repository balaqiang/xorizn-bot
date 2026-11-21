// Fitur search/getmusik — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("search/getmusik", {
  "name": "getmusik",
  "command": [
    "getmusik",
    "dlmusik",
    "downloadmusik"
  ],
  "category": "search",
  "desc": "Download lagu dari hasil carimusik",
  "usage": ".getmusik <nomor>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
