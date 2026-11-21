// Fitur game/pixzo — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("game/pixzo", {
  "name": "pixzo",
  "command": [
    "pixzo"
  ],
  "category": "game",
  "desc": "PIXEL MAZE",
  "usage": ".pixzo",
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
