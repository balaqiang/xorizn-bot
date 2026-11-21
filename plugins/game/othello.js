// Fitur game/othello — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("game/othello", {
  "name": "othello",
  "command": [
    "balikbidak"
  ],
  "category": "game",
  "desc": "Game Othello! Kuasai papan dengan membalik bidak lawan.",
  "usage": ".othello [@lawan]",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
