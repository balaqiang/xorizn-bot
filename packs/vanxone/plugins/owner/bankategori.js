// Fitur owner/bankategori — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/bankategori", {
  "name": "bankategori",
  "command": [
    "bankategori",
    "bancat",
    "bancategory"
  ],
  "category": "owner",
  "desc": "Ban/unban/list kategori plugin",
  "usage": ".bankategori <kategori> [global/@user] | -unban <kategori> [global/@user] | -list",
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
