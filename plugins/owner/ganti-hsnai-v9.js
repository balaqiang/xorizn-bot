// Fitur owner/ganti-hsnai-v9 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-hsnai-v9", {
  "name": "ganti-hsnai-v9.jpg",
  "command": [
    "ganti-hsnai-v9.jpg",
    "gantihsnaiv9",
    "sethsnaiv9"
  ],
  "category": "owner",
  "desc": "Ganti gambar hsnai-v9.jpg (thumbnail welcome)",
  "usage": ".ganti-hsnai-v9.jpg (reply/kirim gambar atau URL)",
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
