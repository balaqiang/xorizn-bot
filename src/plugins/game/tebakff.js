// Fitur game/tebakff — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("game/tebakff", {
  "name": "tebakff",
  "command": [
    "tebakff",
    "whoff"
  ],
  "category": "game",
  "desc": "",
  "usage": "",
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
