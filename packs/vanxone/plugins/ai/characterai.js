// Fitur ai/characterai — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/characterai", {
  "name": "character-ai",
  "command": [
    "character-ai",
    "cai",
    "charai"
  ],
  "category": "ai",
  "desc": "Cari karakter AI dan jadikan sebagai Auto AI di chat ini",
  "usage": ".character-ai search <nama> | .character-ai off | .character-ai reset",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
