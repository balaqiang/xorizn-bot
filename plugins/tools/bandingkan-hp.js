// Fitur tools/bandingkan-hp — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/bandingkan-hp", {
  "name": "bandingkan-hp",
  "command": [
    "bandingkan-hp",
    "bandingkanhp",
    "comparehp"
  ],
  "category": "tools",
  "desc": "Membandingkan dua spesifikasi smartphone dari Carisinyal.",
  "usage": ".bandingkan-hp <hp1> | <hp2>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
