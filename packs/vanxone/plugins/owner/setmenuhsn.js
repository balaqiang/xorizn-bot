// Fitur owner/setmenuhsn — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/setmenuhsn", {
  "name": "setmenuhsn",
  "command": [
    "setmenuhsn",
    "menuhsnstyle",
    "menuhsnvariant"
  ],
  "category": "owner",
  "desc": "Mengatur variant tampilan menuhsn",
  "usage": ".setmenuhsn <v1-v5>",
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
