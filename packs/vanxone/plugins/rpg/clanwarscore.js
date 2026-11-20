// Fitur clan/clanwarscore — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("clan/clanwarscore", {
  "name": "clanwarscore",
  "command": [
    "clanwarscore",
    "warscores",
    "scorewar",
    "skorwar"
  ],
  "category": "rpg",
  "desc": "Lihat skor clan war",
  "usage": ".clanwarscore",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
