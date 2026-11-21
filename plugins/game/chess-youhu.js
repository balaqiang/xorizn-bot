// Fitur game/chess-youhu — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/chess-youhu", {
  "name": "chess-youhu",
  "command": [
    "chess-youhu",
    "mini-chess"
  ],
  "category": "game",
  "desc": "Youhu Mini Chess",
  "usage": ".chess",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
