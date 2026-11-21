// Fitur clan/claninfo — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("clan/claninfo", {
  "name": "claninfo",
  "command": [
    "claninfo",
    "infoclan",
    "myclan",
    "guildinfo"
  ],
  "category": "rpg",
  "desc": "Lihat info clan",
  "usage": ".claninfo [clan_id]",
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
