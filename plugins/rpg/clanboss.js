// Fitur clan/clanboss — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("clan/clanboss", {
  "name": "clanboss",
  "command": [
    "clanboss",
    "bossclan",
    "clanraidboss"
  ],
  "category": "rpg",
  "desc": "Fight boss clan untuk dapet XP dan reward",
  "usage": ".clanboss",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 300,
  "energi": 5,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
