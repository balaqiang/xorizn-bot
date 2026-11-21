// Fitur clan/clanleave — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("clan/clanleave", {
  "name": "clanleave",
  "command": [
    "clanleave",
    "leaveclan",
    "guildleave"
  ],
  "category": "rpg",
  "desc": "Keluar dari clan",
  "usage": ".clanleave",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
