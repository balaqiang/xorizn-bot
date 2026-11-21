// Fitur search/kodepos — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("search/kodepos", {
  "name": "kodepos",
  "command": [
    "kodepos"
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
