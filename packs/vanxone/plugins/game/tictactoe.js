// Fitur game/tictactoe — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("game/tictactoe", {
  "name": "xozo",
  "command": [
    "xozo"
  ],
  "category": "game",
  "desc": "Tic Tac Toe USER VS ROBOT",
  "usage": ".xozo",
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
