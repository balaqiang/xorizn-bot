// Fitur owner/ganti-orbit2 — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("owner/ganti-orbit2", {
  "name": "ganti-orbit2.jpg",
  "command": [
    "ganti-orbit2.jpg",
    "gantiorbit2",
    "setorbit2"
  ],
  "category": "owner",
  "desc": "Ganti gambar orbit2.jpg",
  "usage": ".ganti-orbit2.jpg (reply/kirim gambar)",
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
