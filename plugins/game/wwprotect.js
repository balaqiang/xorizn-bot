// Fitur game/wwprotect — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/wwprotect", {
  "name": "wwprotect",
  "command": [
    "wwprotect",
    "protect",
    "guardian",
    "wpr"
  ],
  "category": "game",
  "desc": "Guardian night action - Protect target",
  "usage": ".wwprotect <nomor>",
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
