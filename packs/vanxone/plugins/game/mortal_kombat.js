// Fitur game/mortal_kombat — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/mortal_kombat", {
  "name": "mortalkombat",
  "command": [
    "mortalkombat",
    "mortal",
    "mk"
  ],
  "category": "game",
  "desc": "Mortal Kombat mini - fight 1 vs 1!",
  "usage": "",
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
