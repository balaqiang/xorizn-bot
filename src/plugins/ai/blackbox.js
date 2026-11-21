// Fitur ai/blackbox — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ai/blackbox", {
  "name": "zenith-blackbox",
  "command": [
    "zenith-blackbox",
    "blackbox",
    "bbox"
  ],
  "category": "ai",
  "desc": "Blackbox AI dari xorizn-bot, dipasang sebagai plugin native xorizn-bot",
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
