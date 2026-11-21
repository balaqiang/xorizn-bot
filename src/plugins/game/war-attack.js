// Fitur game/war-attack — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("game/war-attack", {
  "name": "attack",
  "command": [
    "attack",
    "atk"
  ],
  "category": "game",
  "desc": "",
  "usage": "",
  "owner": false,
  "group": true,
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
