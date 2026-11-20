// Fitur rpg/duel — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/duel", {
  "name": "duel",
  "command": [
    "duel"
  ],
  "category": "rpg",
  "desc": "Duel PvP dengan player lain",
  "usage": ".duel @user <bet>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 120,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
