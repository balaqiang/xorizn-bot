// Fitur game/kjzo — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("game/kjzo", {
  "name": "kjzo",
  "command": [
    "kjzo"
  ],
  "category": "game",
  "desc": "VEMZO CHASE RUNNER",
  "usage": ".kjzo",
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
