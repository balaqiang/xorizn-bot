// Fitur owner/ganti-auroraai-v10 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-auroraai-v10", {
  "name": "ganti-auroraai-v10.jpg",
  "command": [
    "ganti-auroraai-v10.jpg",
    "gantiauroraaiv10",
    "setauroraaiv10"
  ],
  "category": "owner",
  "desc": "Ganti gambar auroraai-v10.jpg",
  "usage": ".ganti-auroraai-v10.jpg (reply/kirim gambar atau URL)",
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
