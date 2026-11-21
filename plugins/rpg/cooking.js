// Fitur rpg/cooking — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/cooking", {
  "name": "cooking",
  "command": [
    "cooking",
    "chef"
  ],
  "category": "rpg",
  "desc": "Masak makanan untuk stamina dan HP",
  "usage": ".cooking <recipe>",
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
