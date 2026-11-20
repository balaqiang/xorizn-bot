// Fitur game/dino-youhu — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/dino-youhu", {
  "name": "dino-youhu",
  "command": [
    "dino-youhu",
    "runner"
  ],
  "category": "game",
  "desc": "Youhu Dino Runner",
  "usage": ".dino",
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
