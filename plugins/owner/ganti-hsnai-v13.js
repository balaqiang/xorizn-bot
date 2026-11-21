// Fitur owner/ganti-hsnai-v13 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-hsnai-v13", {
  "name": "ganti-hsnai-v13.jpg",
  "command": [
    "ganti-hsnai-v13.jpg",
    "gantihsnaiv13",
    "sethsnaiv13"
  ],
  "category": "owner",
  "desc": "Ganti gambar hsnai-v13.jpg",
  "usage": ".ganti-hsnai-v13.jpg (reply/kirim gambar atau URL)",
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
