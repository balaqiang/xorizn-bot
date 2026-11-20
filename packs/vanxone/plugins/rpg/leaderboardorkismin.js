// Fitur economy/leaderboardorkismin — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("economy/leaderboardorkismin", {
  "name": "leaderboard-orang-miskin",
  "command": [
    "leaderboard-orang-miskin",
    "topmiskin",
    "orangmiskin",
    "lbmiskin",
    "poorest",
    "toppoor"
  ],
  "category": "rpg",
  "desc": "Ranking orang paling miskin versi Rimuru 🗿💸",
  "usage": ".topmiskin",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
