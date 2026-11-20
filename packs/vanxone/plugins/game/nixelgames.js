// Fitur game/nixelgames — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/nixelgames", {
  "name": "nixelgames",
  "command": [
    "nixelgames",
    "nixel",
    "nixelgame",
    "minigames"
  ],
  "category": "game",
  "desc": "Kumpulan mini game AI Rich: Dino Runner, Tic Tac Toe, dan Doom",
  "usage": ".nixelgames",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 2,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
