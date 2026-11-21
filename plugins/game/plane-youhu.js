// Fitur game/plane-youhu — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/plane-youhu", {
  "name": "plane-youhu",
  "command": [
    "plane-youhu",
    "plane",
    "spacerush"
  ],
  "category": "game",
  "desc": "Youhu Space Rush",
  "usage": ".plane",
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
