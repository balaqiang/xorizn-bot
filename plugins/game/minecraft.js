// Fitur game/minecraft — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/minecraft", {
  "name": "mct",
  "command": [
    "mct",
    "minecraft"
  ],
  "category": "game",
  "desc": "Minecraft - Mining & Crafting Game",
  "usage": ".mct <command>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
