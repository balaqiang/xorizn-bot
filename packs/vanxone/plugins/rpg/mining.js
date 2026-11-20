// Fitur rpg/mining — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/mining", {
  "name": "mining",
  "command": [
    "mine"
  ],
  "category": "rpg",
  "desc": "Menambang untuk mendapatkan ores dan gems",
  "usage": ".mining",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 60,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
