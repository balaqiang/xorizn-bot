// Fitur game/ttc-youhu — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/ttc-youhu", {
  "name": "ttc-youhu",
  "command": [
    "ttc-youhu",
    "ttc"
  ],
  "category": "game",
  "desc": "Youhu Tic-Tac-Toe Premium",
  "usage": ".ttc",
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
