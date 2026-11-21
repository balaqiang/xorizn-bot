// Fitur tools/tebalteks — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/tebalteks", {
  "name": "tebalteks",
  "command": [
    "tebalteks",
    "boldtext"
  ],
  "category": "tools",
  "desc": "Teks tebal ala xorizn-bot 😈💗 (4 style)",
  "usage": ".tebalteks <teks>",
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
