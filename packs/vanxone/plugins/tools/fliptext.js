// Fitur tools/fliptext — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/fliptext", {
  "name": "fliptext",
  "command": [
    "fliptext",
    "baliktext"
  ],
  "category": "tools",
  "desc": "Membalik susunan teks",
  "usage": ".fliptext <teks>",
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
