// Fitur owner/resetrules — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/resetrules", {
  "name": "resetrules",
  "command": [
    "resetrules",
    "resetbotrules"
  ],
  "category": "owner",
  "desc": "Reset rules bot ke default",
  "usage": ".resetrules",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
