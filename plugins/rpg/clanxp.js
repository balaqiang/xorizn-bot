// Fitur clan/clanxp — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("clan/clanxp", {
  "name": "clanxp",
  "command": [
    "clanxp",
    "xpclan",
    "clanexp"
  ],
  "category": "rpg",
  "desc": "Lihat XP clan dan kontribusi member",
  "usage": ".clanxp",
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
