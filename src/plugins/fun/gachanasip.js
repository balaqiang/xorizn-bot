// Fitur fun/gachanasip — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("fun/gachanasip", {
  "name": "gachanasip",
  "command": [
    "gachanasip"
  ],
  "category": "fun",
  "desc": "Random nasip / hoki / keberuntungan buat user",
  "usage": ".gachanasip",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
