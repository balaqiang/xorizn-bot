// Fitur owner/gantifile — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/gantifile", {
  "name": "gantifile",
  "command": [
    "gantifile",
    "replacefile",
    "updatefile"
  ],
  "category": "owner",
  "desc": "Ganti file apapun di server via path",
  "usage": ".gantifile <path>",
  "owner": true,
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
