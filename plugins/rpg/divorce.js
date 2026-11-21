// Fitur rpg/divorce — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/divorce", {
  "name": "divorce",
  "command": [
    "divorce",
    "pisah"
  ],
  "category": "rpg",
  "desc": "Bercerai dari pasangan",
  "usage": ".divorce",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 60,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
