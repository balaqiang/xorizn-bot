// Fitur owner/setbell — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/setbell", {
  "name": "setbell",
  "command": [
    "setbell",
    "set"
  ],
  "category": "owner",
  "desc": "Aktif/nonaktifkan AutoAI Bell berbasis Termai/XTerm",
  "usage": ".set bell on|off",
  "owner": true,
  "group": true,
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
