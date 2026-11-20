// Fitur owner/ganti-hsnai-winner — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-hsnai-winner", {
  "name": "ganti-hsnai-winner.jpg",
  "command": [
    "ganti-hsnai-winner.jpg",
    "gantihsnaiwinner",
    "sethsnaiwinner"
  ],
  "category": "owner",
  "desc": "Ganti gambar hsnai-winner.jpg (thumbnail game winner)",
  "usage": ".ganti-hsnai-winner.jpg (reply/kirim gambar atau URL)",
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
