// Fitur rpg/guild — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/guild", {
  "name": "guild",
  "command": [
    "clan",
    "team",
    "kelompok"
  ],
  "category": "rpg",
  "desc": "Sistem guild/clan",
  "usage": ".guild <create/join/leave/info>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
