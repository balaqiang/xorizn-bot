// Fitur owner/ganti-auroraai-v7 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-auroraai-v7", {
  "name": "ganti-auroraai-v7.jpg",
  "command": [
    "ganti-auroraai-v7.jpg",
    "gantiauroraaiv7",
    "setauroraaiv7"
  ],
  "category": "owner",
  "desc": "Ganti gambar auroraai-v7.jpg",
  "usage": ".ganti-auroraai-v7.jpg (reply/kirim gambar atau URL)",
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
