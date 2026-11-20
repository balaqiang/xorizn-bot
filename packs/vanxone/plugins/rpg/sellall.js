// Fitur rpg/sellall — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/sellall", {
  "name": "sellall",
  "command": [
    "sellall",
    "jualsemua",
    "quicksell"
  ],
  "category": "rpg",
  "desc": "Jual semua item yang bisa dijual sekaligus",
  "usage": ".sellall",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
