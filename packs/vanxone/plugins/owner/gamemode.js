// Fitur owner/gamemode — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/gamemode", {
  "name": "gamemode",
  "command": [
    "gamemode",
    "gm",
    "setrole"
  ],
  "category": "owner",
  "desc": "Set role user: creative (owner), survival (user biasa), spectator (diabaikan bot)",
  "usage": ".gamemode @user/nomor <creative|c|survival|s|spectator|sp>",
  "owner": true,
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
