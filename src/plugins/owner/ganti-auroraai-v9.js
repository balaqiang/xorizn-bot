// Fitur owner/ganti-auroraai-v9 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-auroraai-v9", {
  "name": "ganti-auroraai-v9.jpg",
  "command": [
    "ganti-auroraai-v9.jpg",
    "gantiauroraaiv9",
    "setauroraaiv9"
  ],
  "category": "owner",
  "desc": "Ganti gambar auroraai-v9.jpg (thumbnail welcome)",
  "usage": ".ganti-auroraai-v9.jpg (reply/kirim gambar atau URL)",
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
