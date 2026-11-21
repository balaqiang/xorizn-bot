// Fitur owner/ganti-auroraai-v13 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-auroraai-v13", {
  "name": "ganti-auroraai-v13.jpg",
  "command": [
    "ganti-auroraai-v13.jpg",
    "gantiauroraaiv13",
    "setauroraaiv13"
  ],
  "category": "owner",
  "desc": "Ganti gambar auroraai-v13.jpg",
  "usage": ".ganti-auroraai-v13.jpg (reply/kirim gambar atau URL)",
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
