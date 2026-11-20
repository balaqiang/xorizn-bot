// Fitur ai/blackbox — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ai/blackbox", {
  "name": "rimuru-blackbox",
  "command": [
    "rimuru-blackbox",
    "blackbox",
    "bbox"
  ],
  "category": "ai",
  "desc": "Blackbox AI dari Rimuru, dipasang sebagai plugin native Rimuru",
  "usage": ".blackbox <pertanyaan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
