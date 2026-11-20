// Fitur owner/controlgrup — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/controlgrup", {
  "name": "controlgrup",
  "command": [
    "controlgrup",
    "ctrlgc",
    "controlgc"
  ],
  "category": "owner",
  "desc": "Kontrol grup jarak jauh",
  "usage": ".ctrlgc <id/index> <aksi>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
