// Fitur info/gag2 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("info/gag2", {
  "name": "gag2",
  "command": [
    "gag2",
    "growagarden2"
  ],
  "category": "info",
  "desc": "Cek stock Grow a Garden dengan fitur watch",
  "usage": ".gag2 [watch] [item]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
