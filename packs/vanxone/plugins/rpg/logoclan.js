// Fitur clan/logoclan — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("clan/logoclan", {
  "name": "clanlogo",
  "command": [
    "clanlogo",
    "setlogo",
    "clanicon"
  ],
  "category": "rpg",
  "desc": "Set logo clan (reply gambar)",
  "usage": ".clanlogo (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 20,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
