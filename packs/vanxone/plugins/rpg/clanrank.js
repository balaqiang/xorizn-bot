// Fitur clan/clanrank — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("clan/clanrank", {
  "name": "clanrank",
  "command": [
    "clanrank",
    "rankclan",
    "peringkatclan"
  ],
  "category": "rpg",
  "desc": "Lihat peringkat clan kamu",
  "usage": ".clanrank",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
