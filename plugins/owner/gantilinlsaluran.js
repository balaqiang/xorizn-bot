// Fitur owner/gantilinlsaluran — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/gantilinlsaluran", {
  "name": "gantilinksaluran",
  "command": [
    "gantilinksaluran",
    "setlinksaluran"
  ],
  "category": "owner",
  "desc": "Mengganti semua link saluran di SC",
  "usage": ".gantilinksaluran|link",
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
