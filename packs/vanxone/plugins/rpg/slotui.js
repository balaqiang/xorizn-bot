// Fitur rpg/slotui — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/slotui", {
  "name": "slotui",
  "command": [
    "slotui",
    "slotgame",
    "fruitbonanza"
  ],
  "category": "rpg",
  "desc": "Fruit Bonanza slot machine dengan UI HTML interaktif.",
  "usage": ".slotui",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
