// Fitur owner/ganti-auroraai3 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-auroraai3", {
  "name": "ganti-auroraai3.jpg",
  "command": [
    "ganti-auroraai3.jpg",
    "gantiauroraai3",
    "setauroraai3"
  ],
  "category": "owner",
  "desc": "Ganti gambar auroraai3.jpg",
  "usage": ".ganti-auroraai3.jpg (reply/kirim gambar atau URL)",
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
