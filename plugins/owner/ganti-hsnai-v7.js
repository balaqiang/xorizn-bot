// Fitur owner/ganti-hsnai-v7 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-hsnai-v7", {
  "name": "ganti-hsnai-v7.jpg",
  "command": [
    "ganti-hsnai-v7.jpg",
    "gantihsnaiv7",
    "sethsnaiv7"
  ],
  "category": "owner",
  "desc": "Ganti gambar hsnai-v7.jpg",
  "usage": ".ganti-hsnai-v7.jpg (reply/kirim gambar atau URL)",
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
