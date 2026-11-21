// Fitur rpg/jualan — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/jualan", {
  "name": "jualan",
  "command": [
    "jualan",
    "dagang",
    "pedagang"
  ],
  "category": "rpg",
  "desc": "Dagang asongan keliling",
  "usage": ".jualan",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 180,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
