// Fitur game/mbim-youhu — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/mbim-youhu", {
  "name": "mbim-youhu",
  "command": [
    "mbim-youhu",
    "mbim",
    "highway",
    "car"
  ],
  "category": "game",
  "desc": "Youhu Highway Rush",
  "usage": ".mbim",
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
