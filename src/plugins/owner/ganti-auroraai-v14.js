// Fitur owner/ganti-auroraai-v14 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-auroraai-v14", {
  "name": "ganti-auroraai-v14.jpg",
  "command": [
    "ganti-auroraai-v14.jpg",
    "gantiauroraaiv14",
    "setauroraaiv14"
  ],
  "category": "owner",
  "desc": "Ganti gambar auroraai-v14.jpg",
  "usage": ".ganti-auroraai-v14.jpg (reply/kirim gambar atau URL)",
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
