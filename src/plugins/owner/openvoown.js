// Fitur owner/openvoown — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/openvoown", {
  "name": "openvoown",
  "command": [
    "openvoown",
    "rvoown",
    "voown"
  ],
  "category": "owner",
  "desc": "Membuka pesan 1x lihat dan mengirim ke PM owner",
  "usage": ".openvoown (reply pesan 1x lihat)",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
