// Fitur rpg/merchant — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/merchant", {
  "name": "merchant",
  "command": [
    "merchant",
    "npc",
    "tokoku"
  ],
  "category": "rpg",
  "desc": "Jual beli item ke NPC merchant",
  "usage": ".merchant <buy/sell> <item> <qty>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
