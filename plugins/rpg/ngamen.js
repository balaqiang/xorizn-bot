// Fitur rpg/ngamen — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/ngamen", {
  "name": "ngamen",
  "command": [
    "ngamen",
    "nyanyi",
    "konser"
  ],
  "category": "rpg",
  "desc": "Ngamen di jalanan untuk mencari koin",
  "usage": ".ngamen",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 120,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
