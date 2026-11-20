// Fitur group/game — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/game", {
  "name": "game",
  "command": [
    "game",
    "togglegame"
  ],
  "category": "group",
  "desc": "Mengaktifkan atau menonaktifkan fitur game di grup",
  "usage": ".game <on/off>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
