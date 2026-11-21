// Fitur owner/resetdb — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/resetdb", {
  "name": "resetdb",
  "command": [
    "resetdb",
    "cleardb",
    "wipedb"
  ],
  "category": "owner",
  "desc": "Reset semua data database",
  "usage": ".resetdb [confirm]",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 60,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
