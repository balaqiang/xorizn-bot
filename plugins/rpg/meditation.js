// Fitur rpg/meditation — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/meditation", {
  "name": "meditation",
  "command": [
    "meditation",
    "rest",
    "istirahat"
  ],
  "category": "rpg",
  "desc": "Istirahat untuk pulihkan HP dan stamina",
  "usage": ".meditation",
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
