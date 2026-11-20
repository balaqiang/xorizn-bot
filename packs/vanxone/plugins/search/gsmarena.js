// Fitur search/gsmarena — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/gsmarena", {
  "name": "gsmarena",
  "command": [
    "gsmarena",
    "gsm",
    "phonespec"
  ],
  "category": "search",
  "desc": "Cari spesifikasi HP di GSMArena",
  "usage": ".gsmarena <nama hp>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
