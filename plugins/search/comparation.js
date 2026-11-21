// Fitur search/comparation — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("search/comparation", {
  "name": "advance-comparation",
  "command": [
    "advance-comparation",
    "bandingkan-device",
    "compare"
  ],
  "category": "search",
  "desc": "Bandingkan dua perangkat (smartphone, tablet, laptop, dll)",
  "usage": ".bandingkan-device [type] <query>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
})
