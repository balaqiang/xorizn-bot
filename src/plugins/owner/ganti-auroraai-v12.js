// Fitur owner/ganti-auroraai-v12 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-auroraai-v12", {
  "name": "ganti-auroraai-v12.jpg",
  "command": [
    "ganti-auroraai-v12.jpg",
    "gantiauroraaiv12",
    "setauroraaiv12"
  ],
  "category": "owner",
  "desc": "Ganti gambar auroraai-v12.jpg",
  "usage": ".ganti-auroraai-v12.jpg (reply/kirim gambar atau URL)",
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
