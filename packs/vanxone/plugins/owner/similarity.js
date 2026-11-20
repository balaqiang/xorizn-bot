// Fitur owner/similarity — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/similarity", {
  "name": "similarity",
  "command": [
    "similarity",
    "setsimilarity",
    "sim"
  ],
  "category": "owner",
  "desc": "Mengaktifkan/menonaktifkan fitur similarity (saran typo)",
  "usage": ".similarity <on/off>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
