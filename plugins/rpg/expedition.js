// Fitur rpg/expedition — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/expedition", {
  "name": "expedition",
  "command": [
    "expedition",
    "ekspedisi",
    "exp"
  ],
  "category": "rpg",
  "desc": "Kirim ekspedisi otomatis untuk item",
  "usage": ".expedition <start/claim/status>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
