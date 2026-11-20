// Fitur game/wwsee — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/wwsee", {
  "name": "wwsee",
  "command": [
    "wwsee",
    "seer",
    "vision",
    "wse"
  ],
  "category": "game",
  "desc": "Seer night action - See target role",
  "usage": ".wwsee <nomor>",
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
