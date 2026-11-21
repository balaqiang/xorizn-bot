// Fitur owner/ganti-hsnai-v14 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-hsnai-v14", {
  "name": "ganti-hsnai-v14.jpg",
  "command": [
    "ganti-hsnai-v14.jpg",
    "gantihsnaiv14",
    "sethsnaiv14"
  ],
  "category": "owner",
  "desc": "Ganti gambar hsnai-v14.jpg",
  "usage": ".ganti-hsnai-v14.jpg (reply/kirim gambar atau URL)",
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
