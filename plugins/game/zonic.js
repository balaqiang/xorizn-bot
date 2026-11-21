// Fitur game/zonic — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("game/zonic", {
  "name": "zonic",
  "command": [
    "zonic",
    "sonicvemzo"
  ],
  "category": "game",
  "desc": "ZONIC Speed Adventure - Dual Platforms Edition",
  "usage": ".zonic",
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
