// Fitur owner/ganti-hsnai3 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-hsnai3", {
  "name": "ganti-hsnai3.jpg",
  "command": [
    "ganti-hsnai3.jpg",
    "gantihsnai3",
    "sethsnai3"
  ],
  "category": "owner",
  "desc": "Ganti gambar hsnai3.jpg",
  "usage": ".ganti-hsnai3.jpg (reply/kirim gambar atau URL)",
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
