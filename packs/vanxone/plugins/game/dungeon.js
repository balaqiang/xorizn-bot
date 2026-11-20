// Fitur game/dungeon — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/dungeon", {
  "name": "dungeon",
  "command": [
    "dg",
    "explore"
  ],
  "category": "game",
  "desc": "Jelajahi dungeon dan lawan monster secara interaktif",
  "usage": ".dungeon",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 60,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
