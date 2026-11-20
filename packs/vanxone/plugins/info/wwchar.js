// Fitur info/wwchar — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("info/wwchar", {
  "name": "wwchar",
  "command": [
    "wwchar"
  ],
  "category": "info",
  "desc": "Informasi karakter Wuthering Waves",
  "usage": ".wwchar <nama karakter>",
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
