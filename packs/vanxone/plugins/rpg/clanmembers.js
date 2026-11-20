// Fitur clan/clanmembers — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("clan/clanmembers", {
  "name": "clanmembers",
  "command": [
    "clanmembers",
    "clanmember",
    "guildmembers"
  ],
  "category": "rpg",
  "desc": "Lihat daftar member clan",
  "usage": ".clanmembers",
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
