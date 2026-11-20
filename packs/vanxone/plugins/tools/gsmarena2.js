// Fitur tools/gsmarena2 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/gsmarena2", {
  "name": "gsmarena2",
  "command": [
    "gsmarena2",
    "gsmspek2",
    "hpspek2"
  ],
  "category": "tools",
  "desc": "Pencarian spesifikasi HP GSM Arena (varian Tensura).",
  "usage": ".gsmarena2 <nama hp>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
