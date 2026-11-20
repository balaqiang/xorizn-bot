// Fitur owner/integritytest — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/integritytest", {
  "name": "integritytest",
  "command": [
    "integritytest",
    "integrity",
    "itest"
  ],
  "category": "owner",
  "desc": "Tes integritas WM dan identitas fitur secara lokal.",
  "usage": ".integritytest",
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
