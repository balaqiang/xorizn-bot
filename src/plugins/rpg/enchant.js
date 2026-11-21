// Fitur rpg/enchant — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/enchant", {
  "name": "enchant",
  "command": [
    "enchant",
    "upgrade",
    "tingkatkan"
  ],
  "category": "rpg",
  "desc": "Upgrade equipment dengan enchantment",
  "usage": ".enchant <item>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 120,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
