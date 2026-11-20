// Fitur rpg/berladang — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("rpg/berladang", {
  "name": "berladang",
  "command": [
    "berladang",
    "farm",
    "tanam"
  ],
  "category": "rpg",
  "desc": "Berladang untuk mendapat hasil panen",
  "usage": ".berladang",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 180,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
