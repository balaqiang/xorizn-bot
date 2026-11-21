// Fitur rpg/inventory — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/inventory", {
  "name": "inventory",
  "command": [
    "tas",
    "bag"
  ],
  "category": "rpg",
  "desc": "Melihat isi inventory RPG",
  "usage": ".inventory",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
