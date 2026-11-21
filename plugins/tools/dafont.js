// Fitur tools/dafont — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/dafont", {
  "name": "dafont",
  "command": [
    "daffont",
    "carifont"
  ],
  "category": "tools",
  "desc": "Cari dan download font dari DaFont",
  "usage": ".dafont <nama font>",
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
    "scrapers": [
      "dafont"
    ],
    "assets": []
  }
})
