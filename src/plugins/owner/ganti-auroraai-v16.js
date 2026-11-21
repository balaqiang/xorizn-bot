// Fitur owner/ganti-auroraai-v16 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-auroraai-v16", {
  "name": "ganti-auroraai-v16.jpg",
  "command": [
    "ganti-auroraai-v16.jpg",
    "gantiauroraaiv16",
    "setauroraaiv16"
  ],
  "category": "owner",
  "desc": "Ganti gambar auroraai-v16.jpg",
  "usage": ".ganti-auroraai-v16.jpg (reply/kirim gambar atau URL)",
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
