// Fitur rpg/ngojek — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/ngojek", {
  "name": "ngojek",
  "command": [
    "ngojek",
    "ojek",
    "gojek",
    "ojol"
  ],
  "category": "rpg",
  "desc": "Ngojek untuk mendapat uang",
  "usage": ".ngojek",
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
