// Fitur game/supermario — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/supermario", {
  "name": "supermario",
  "command": [
    "supermario",
    "mario"
  ],
  "category": "game",
  "desc": "Super Mario Bros mini - lompatin musuh & kumpulin koin!",
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
