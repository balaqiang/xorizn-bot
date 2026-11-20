// Fitur clan/clanraid — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("clan/clanraid", {
  "name": "clanraid",
  "command": [
    "clanraid",
    "raid",
    "clanevent"
  ],
  "category": "rpg",
  "desc": "Mulai raid event clan",
  "usage": ".clanraid",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3600,
  "energi": 10,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
