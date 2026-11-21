// Fitur game/battleshipmp — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("game/battleshipmp", {
  "name": "battleshipmp",
  "command": [
    "battleshipmp",
    "bsmp"
  ],
  "category": "game",
  "desc": "Battleship multiplayer realtime antar perangkat.",
  "usage": ".battleshipmp",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
