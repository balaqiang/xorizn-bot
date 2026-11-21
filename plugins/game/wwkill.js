// Fitur game/wwkill — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/wwkill", {
  "name": "wwkill",
  "command": [
    "wwkill",
    "wolfkill",
    "wk"
  ],
  "category": "game",
  "desc": "Werewolf night action - Kill target",
  "usage": ".wwkill <nomor>",
  "owner": false,
  "group": false,
  "private": true,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
