// Fitur clan/clanjoin — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("clan/clanjoin", {
  "name": "clanjoin",
  "command": [
    "clanjoin",
    "joinclan",
    "guildjoin"
  ],
  "category": "rpg",
  "desc": "Gabung ke clan",
  "usage": ".clanjoin <clan_id>",
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
