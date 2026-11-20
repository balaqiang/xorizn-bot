// Fitur owner/ganti-hsnai-v16 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-hsnai-v16", {
  "name": "ganti-hsnai-v16.jpg",
  "command": [
    "ganti-hsnai-v16.jpg",
    "gantihsnaiv16",
    "sethsnaiv16"
  ],
  "category": "owner",
  "desc": "Ganti gambar hsnai-v16.jpg",
  "usage": ".ganti-hsnai-v16.jpg (reply/kirim gambar atau URL)",
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
