// Fitur owner/ganti-hsnai2 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-hsnai2", {
  "name": "ganti-hsnai2.jpg",
  "command": [
    "ganti-hsnai2.jpg",
    "gantihsnai2",
    "sethsnai2"
  ],
  "category": "owner",
  "desc": "Ganti gambar hsnai2.jpg",
  "usage": ".ganti-hsnai2.jpg (reply/kirim gambar atau URL)",
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
