// Fitur game/fisch — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/fisch", {
  "name": "fisht",
  "command": [
    "fisht",
    "fishit"
  ],
  "category": "game",
  "desc": "Fishit - Fishing Rod Game",
  "usage": ".fisht <command>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
