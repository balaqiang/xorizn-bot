// Fitur owner/whitelistgc — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/whitelistgc", {
  "name": "whitelistgc",
  "command": [
    "whitelistgc",
    "wlgc",
    "unwhitelistgc",
    "unwlgc",
    "listwhitelistgc",
    "listwlgc",
    "whitelistmode"
  ],
  "category": "owner",
  "desc": "Mode whitelist — bot hanya aktif di grup yang didaftarkan",
  "usage": ".whitelistgc <id> | .unwhitelistgc <id> | .listwlgc | .whitelistmode on/off",
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
