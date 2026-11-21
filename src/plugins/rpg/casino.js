// Fitur rpg/casino — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/casino", {
  "name": "casino",
  "command": [
    "gamble"
  ],
  "category": "rpg",
  "desc": "Bermain casino untuk judi",
  "usage": ".casino <jumlah>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
