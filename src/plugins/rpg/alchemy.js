// Fitur rpg/alchemy — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/alchemy", {
  "name": "alchemy",
  "command": [
    "alchemy",
    "potion",
    "brew",
    "ramuan"
  ],
  "category": "rpg",
  "desc": "Buat potion dan ramuan dari herba",
  "usage": ".alchemy <potion>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 60,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
