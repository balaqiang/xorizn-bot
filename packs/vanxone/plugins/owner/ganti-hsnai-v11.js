// Fitur owner/ganti-hsnai-v11 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-hsnai-v11", {
  "name": "ganti-hsnai-v11.jpg",
  "command": [
    "ganti-hsnai-v11.jpg",
    "gantihsnaiv11",
    "sethsnaiv11"
  ],
  "category": "owner",
  "desc": "Ganti gambar hsnai-v11.jpg",
  "usage": ".ganti-hsnai-v11.jpg (reply/kirim gambar atau URL)",
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
