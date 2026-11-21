// Fitur game/quoridormp — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("game/quoridormp", {
  "name": "quoridormp",
  "command": [
    "quoridormp",
    "qmp",
    "quoridor",
    "mazeracemp"
  ],
  "category": "game",
  "desc": "QuoridorMP - game strategi maze race 10x10, multiplayer realtime antar perangkat, lengkap dengan home, global chat, room chat, spectator, dan rematch.",
  "usage": ".quoridormp",
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
