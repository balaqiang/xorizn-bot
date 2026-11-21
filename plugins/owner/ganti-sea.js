// Fitur owner/ganti-sea — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-sea", {
  "name": "ganti-sea.jpg",
  "command": [
    "ganti-sea.jpg",
    "gantisea",
    "setsea"
  ],
  "category": "owner",
  "desc": "Ganti gambar sea.jpg",
  "usage": ".ganti-sea.jpg (reply/kirim gambar atau URL)",
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
