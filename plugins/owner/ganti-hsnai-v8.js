// Fitur owner/ganti-hsnai-v8 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-hsnai-v8", {
  "name": "ganti-hsnai-v8.jpg",
  "command": [
    "ganti-hsnai-v8.jpg",
    "gantihsnaiv8",
    "sethsnaiv8"
  ],
  "category": "owner",
  "desc": "Ganti gambar hsnai-v8.jpg (thumbnail welcome)",
  "usage": ".ganti-hsnai-v8.jpg (reply/kirim gambar atau URL)",
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
