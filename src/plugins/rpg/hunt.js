// Fitur rpg/hunt — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/hunt", {
  "name": "hunt",
  "command": [
    "hunting"
  ],
  "category": "rpg",
  "desc": "Berburu hewan untuk mendapatkan daging dan kulit",
  "usage": ".hunt",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 90,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
