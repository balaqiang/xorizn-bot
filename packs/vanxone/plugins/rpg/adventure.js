// Fitur rpg/adventure — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/adventure", {
  "name": "adventure",
  "command": [
    "adv",
    "petualangan"
  ],
  "category": "rpg",
  "desc": "Berpetualang untuk mendapat Exp dan hadiah",
  "usage": ".adventure",
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
