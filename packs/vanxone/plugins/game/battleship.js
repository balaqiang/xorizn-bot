// Fitur game/battleship — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("game/battleship", {
  "name": "battleship",
  "command": [
    "bs"
  ],
  "category": "game",
  "desc": "Battleship 2 pemain dalam 1 perangkat.",
  "usage": ".battleship",
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
