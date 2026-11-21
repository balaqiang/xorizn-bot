// Fitur owner/ganti-auroraai-v8 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-auroraai-v8", {
  "name": "ganti-auroraai-v8.jpg",
  "command": [
    "ganti-auroraai-v8.jpg",
    "gantiauroraaiv8",
    "setauroraaiv8"
  ],
  "category": "owner",
  "desc": "Ganti gambar auroraai-v8.jpg (thumbnail welcome)",
  "usage": ".ganti-auroraai-v8.jpg (reply/kirim gambar atau URL)",
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
