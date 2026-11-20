// Fitur owner/ganti-hsnai-v12 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-hsnai-v12", {
  "name": "ganti-hsnai-v12.jpg",
  "command": [
    "ganti-hsnai-v12.jpg",
    "gantihsnaiv12",
    "sethsnaiv12"
  ],
  "category": "owner",
  "desc": "Ganti gambar hsnai-v12.jpg",
  "usage": ".ganti-hsnai-v12.jpg (reply/kirim gambar atau URL)",
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
