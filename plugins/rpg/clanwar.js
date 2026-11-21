// Fitur clan/clanwar — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("clan/clanwar", {
  "name": "clanwar",
  "command": [
    "clanwar",
    "war",
    "guildwar"
  ],
  "category": "rpg",
  "desc": "War melawan clan lain",
  "usage": ".clanwar <clan_id>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3600,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
