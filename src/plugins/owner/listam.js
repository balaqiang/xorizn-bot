// Fitur owner/listam — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/listam", {
  "name": "listam",
  "command": [
    "listam",
    "amlist",
    "listroleam"
  ],
  "category": "owner",
  "desc": "List user role Alight Motion",
  "usage": ".listam [role]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
