// Fitur rpg/quest — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/quest", {
  "name": "quest",
  "command": [
    "misi",
    "mission",
    "bounty"
  ],
  "category": "rpg",
  "desc": "Ambil quest harian untuk reward bonus",
  "usage": ".quest",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
