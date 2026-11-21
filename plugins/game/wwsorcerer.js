// Fitur game/wwsorcerer — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/wwsorcerer", {
  "name": "wwsorcerer",
  "command": [
    "wwsorcerer",
    "sorcerer",
    "wws"
  ],
  "category": "game",
  "desc": "Sorcerer night action - Check if target is Seer",
  "usage": ".wwsorcerer <nomor>",
  "owner": false,
  "group": false,
  "private": true,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
