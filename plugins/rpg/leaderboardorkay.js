// Fitur economy/leaderboardorkay — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("economy/leaderboardorkay", {
  "name": "leaderboard-orang-kaya",
  "command": [
    "leaderboard-orang-kaya",
    "topkaya",
    "orangkaya",
    "lbkaya",
    "toprich",
    "leaderboardkaya"
  ],
  "category": "rpg",
  "desc": "Ranking orang paling kaya ala Rimuru dengan dashboard keren 💰🔥",
  "usage": ".topkaya",
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
