// Fitur rpg/steal — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/steal", {
  "name": "steal",
  "command": [
    "steal",
    "mencuri",
    "pickpocket"
  ],
  "category": "rpg",
  "desc": "Mencuri dari NPC untuk gold",
  "usage": ".steal",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 300,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
