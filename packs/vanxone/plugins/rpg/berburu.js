// Fitur rpg/berburu — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/berburu", {
  "name": "berburu",
  "command": [
    "huntanimal",
    "buru"
  ],
  "category": "rpg",
  "desc": "Berburu hewan untuk mendapat item",
  "usage": ".berburu",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 120,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
