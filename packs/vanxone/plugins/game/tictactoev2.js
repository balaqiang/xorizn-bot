// Fitur game/tictactoev2 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("game/tictactoev2", {
  "name": "tictactoev2",
  "command": [
    "tictactoev2",
    "tttv2",
    "xov2"
  ],
  "category": "game",
  "desc": "TicTacToe V2 — max 3 bidak per pemain, lalu pindah-pindah!",
  "usage": ".tictactoev2 [room name]",
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
