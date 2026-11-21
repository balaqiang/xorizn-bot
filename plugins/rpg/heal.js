// Fitur rpg/heal — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/heal", {
  "name": "heal",
  "command": [
    "sembuh",
    "recover"
  ],
  "category": "rpg",
  "desc": "Pulihkan health dengan istirahat (gratis tapi lama)",
  "usage": ".heal",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 600,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
