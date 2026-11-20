// Fitur owner/ganti-hsnai — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-hsnai", {
  "name": "ganti-hsnai.jpg",
  "command": [
    "ganti-hsnai.jpg",
    "gantihsnai",
    "sethsnai"
  ],
  "category": "owner",
  "desc": "Ganti gambar hsnai.jpg (thumbnail menu)",
  "usage": ".ganti-hsnai.jpg (reply/kirim gambar atau URL)",
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
