// Fitur group/kickall — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("group/kickall", {
  "name": "removeall",
  "command": [
    "removeall"
  ],
  "category": "group",
  "desc": "Kick semua member sekaligus (Instan)",
  "usage": ".kickall",
  "owner": true,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 60,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
