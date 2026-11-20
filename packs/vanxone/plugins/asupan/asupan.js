// Fitur asupan/asupan — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("asupan/asupan", {
  "name": "asupan",
  "command": [
    "asupan",
    "asupanrandom"
  ],
  "category": "asupan",
  "desc": "Random video asupan",
  "usage": ".asupan",
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
