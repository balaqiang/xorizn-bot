// Fitur owner/settqto — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/settqto", {
  "name": "settqto",
  "command": [
    "settqto",
    "settq",
    "tqtoset"
  ],
  "category": "owner",
  "desc": "Mengatur tampilan tqto",
  "usage": ".settqto <v1/v2>",
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
