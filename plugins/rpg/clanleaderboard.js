// Fitur clan/clanleaderboard — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("clan/clanleaderboard", {
  "name": "clanleaderboard",
  "command": [
    "clanleaderboard",
    "clanlb",
    "topclan",
    "guildrank"
  ],
  "category": "rpg",
  "desc": "Lihat ranking clan",
  "usage": ".clanleaderboard",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
