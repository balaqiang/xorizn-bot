// Fitur rpg/crime — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/crime", {
  "name": "crime",
  "command": [
    "crime",
    "curi"
  ],
  "category": "rpg",
  "desc": "Melakukan kejahatan membobol ATM (risiko tinggi)",
  "usage": ".crime",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 300,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
