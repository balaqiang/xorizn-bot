// Fitur rpg/fishing — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/fishing", {
  "name": "fishing",
  "command": [
    "rpgfish"
  ],
  "category": "rpg",
  "desc": "Memancing untuk mendapatkan ikan (RPG)",
  "usage": ".fishing",
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
