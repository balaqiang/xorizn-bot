// Fitur fun/tembak — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("fun/tembak", {
  "name": "tembak",
  "command": [
    "nembak",
    "propose"
  ],
  "category": "fun",
  "desc": "Menembak seseorang untuk pacaran",
  "usage": ".tembak @tag",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
