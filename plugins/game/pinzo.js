// Fitur game/pinzo — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("game/pinzo", {
  "name": "pinzo",
  "command": [
    "pinzo"
  ],
  "category": "game",
  "desc": "Piano 7 Tuts",
  "usage": ".pinzo",
  "owner": false,
  "group": true,
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
