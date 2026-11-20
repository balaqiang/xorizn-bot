// Fitur owner/blacklistgc — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/blacklistgc", {
  "name": "blacklistgc",
  "command": [
    "blacklistgc",
    "blgc",
    "unblacklistgc",
    "unblgc",
    "listblacklistgc",
    "listblgc"
  ],
  "category": "owner",
  "desc": "Blacklist grup tertentu dari menggunakan bot",
  "usage": ".blacklistgc <id/@link> | .unblacklistgc <id> | .listblgc",
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
