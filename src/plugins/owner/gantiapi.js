// Fitur owner/gantiapi — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/gantiapi", {
  "name": "gantiapi",
  "command": [
    "gantiapi",
    "setapi"
  ],
  "category": "owner",
  "desc": "Mengganti API di plugin tertentu",
  "usage": ".gantiapi <plugin> <api>",
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
