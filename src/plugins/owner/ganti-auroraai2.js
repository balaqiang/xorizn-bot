// Fitur owner/ganti-auroraai2 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-auroraai2", {
  "name": "ganti-auroraai2.jpg",
  "command": [
    "ganti-auroraai2.jpg",
    "gantiauroraai2",
    "setauroraai2"
  ],
  "category": "owner",
  "desc": "Ganti gambar auroraai2.jpg",
  "usage": ".ganti-auroraai2.jpg (reply/kirim gambar atau URL)",
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
