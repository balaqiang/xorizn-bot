// Fitur game/balap — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/balap", {
  "name": "balap",
  "command": [
    "balap",
    "racing",
    "race",
    "turborace"
  ],
  "category": "game",
  "desc": "Game Turbo Race HTML AI Rich.",
  "usage": ".balap",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
