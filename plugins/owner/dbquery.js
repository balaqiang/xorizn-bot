// Fitur owner/dbquery — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/dbquery", {
  "name": "dbquery",
  "command": [
    "dbquery",
    "db",
    "dq",
    "dbq"
  ],
  "category": "owner",
  "desc": "Query database langsung via command (Owner Only)",
  "usage": ".db <subcommand> [args]",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 2,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
