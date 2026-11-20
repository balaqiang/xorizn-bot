// Fitur owner/ganti-hsnai-v10 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-hsnai-v10", {
  "name": "ganti-hsnai-v10.jpg",
  "command": [
    "ganti-hsnai-v10.jpg",
    "gantihsnaiv10",
    "sethsnaiv10"
  ],
  "category": "owner",
  "desc": "Ganti gambar hsnai-v10.jpg",
  "usage": ".ganti-hsnai-v10.jpg (reply/kirim gambar atau URL)",
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
