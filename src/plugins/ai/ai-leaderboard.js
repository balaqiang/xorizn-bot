// Fitur ai/ai-leaderboard — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ai/ai-leaderboard", {
  "name": "ai-leaderboard",
  "command": [
    "ai-leaderboard",
    "aileaderboard",
    "aiboard",
    "ailb",
    "lmarena"
  ],
  "category": "ai",
  "desc": "Lihat leaderboard AI model terbaik dari LMArena",
  "usage": ".ai-leaderboard [category]",
  "owner": false,
  "group": false,
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
