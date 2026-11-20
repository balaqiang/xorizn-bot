// Fitur rpg/buykoin — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/buykoin", {
  "name": "buykoin",
  "command": [
    "buykoin",
    "belikoin",
    "belicoin",
    "exptokoin",
    "exptocoin"
  ],
  "category": "rpg",
  "desc": "Tukar EXP menjadi Koin",
  "usage": ".buykoin <jumlah>",
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
