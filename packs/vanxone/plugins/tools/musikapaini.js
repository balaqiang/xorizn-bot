// Fitur tools/musikapaini — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/musikapaini", {
  "name": "musikapaini",
  "command": [
    "musikapaini",
    "recognizemusic",
    "mai"
  ],
  "category": "tools",
  "desc": "Identifikasi lagu dari audio",
  "usage": ".musikapaini (reply audio)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 20,
  "energi": 2,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
})
