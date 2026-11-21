// Fitur owner/ganti-auroraai-v22 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-auroraai-v22", {
  "name": "ganti-auroraai-v22.jpg",
  "command": [
    "ganti-auroraai-v22.jpg",
    "gantiauroraaiv22",
    "setauroraaiv22"
  ],
  "category": "owner",
  "desc": "Ganti gambar auroraai-v22.jpg",
  "usage": ".ganti-auroraai-v22.jpg (reply/kirim gambar atau URL)",
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
