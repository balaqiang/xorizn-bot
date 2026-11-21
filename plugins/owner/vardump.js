// Fitur owner/vardump — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/vardump", {
  "name": "vardump",
  "command": [
    "vardump",
    "vd",
    "dbdump",
    "dbpath",
    "dumpvar"
  ],
  "category": "owner",
  "desc": "Inspect nilai variabel atau path database object (Owner Only)",
  "usage": ".vardump <path>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
