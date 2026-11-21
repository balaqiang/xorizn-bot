// Fitur game/checkerszerotwo — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("game/checkerszerotwo", {
  "name": "checkers",
  "command": [
    "checkers",
    "dam",
    "caturdam",
    "zerocheckers"
  ],
  "category": "game",
  "desc": "Game catur dam / checkers xorizn-bot! Makan semua pion lawan untuk menang.",
  "usage": ".checkers [@lawan]",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
