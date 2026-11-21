// Fitur rpg/use — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/use", {
  "name": "use",
  "command": [
    "use",
    "pake"
  ],
  "category": "rpg",
  "desc": "Menggunakan item consumable atau membuka crate",
  "usage": ".use <item>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
