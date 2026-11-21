// Fitur owner/ganti-auroraai-winner — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-auroraai-winner", {
  "name": "ganti-auroraai-winner.jpg",
  "command": [
    "ganti-auroraai-winner.jpg",
    "gantiauroraaiwinner",
    "setauroraaiwinner"
  ],
  "category": "owner",
  "desc": "Ganti gambar auroraai-winner.jpg (thumbnail game winner)",
  "usage": ".ganti-auroraai-winner.jpg (reply/kirim gambar atau URL)",
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
