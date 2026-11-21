// Fitur game/stickman — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/stickman", {
  "name": "stickman",
  "command": [
    "stickman",
    "stick",
    "stickgame"
  ],
  "category": "game",
  "desc": "Game Stickman HTML AI Rich.",
  "usage": ".stickman",
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
