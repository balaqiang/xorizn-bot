// Fitur clan/clanjoinraid — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("clan/clanjoinraid", {
  "name": "clanraidjoin",
  "command": [
    "clanraidjoin",
    "raidjoin",
    "raidkill"
  ],
  "category": "rpg",
  "desc": "Join raid clan dan kill monster",
  "usage": ".clanraidjoin",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
