// Fitur owner/add — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/add", {
  "name": "oadd",
  "command": [
    "oadd"
  ],
  "category": "owner",
  "desc": "",
  "usage": "",
  "owner": true,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
