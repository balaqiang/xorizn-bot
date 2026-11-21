// Fitur owner/ganti-auroraai-v11 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-auroraai-v11", {
  "name": "ganti-auroraai-v11.jpg",
  "command": [
    "ganti-auroraai-v11.jpg",
    "gantiauroraaiv11",
    "setauroraaiv11"
  ],
  "category": "owner",
  "desc": "Ganti gambar auroraai-v11.jpg",
  "usage": ".ganti-auroraai-v11.jpg (reply/kirim gambar atau URL)",
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
