// Fitur owner/ganti-orbit3 — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("owner/ganti-orbit3", {
  "name": "ganti-orbit3.jpg",
  "command": [
    "ganti-orbit3.jpg",
    "gantiorbit3",
    "setorbit3"
  ],
  "category": "owner",
  "desc": "Ganti gambar orbit3.jpg",
  "usage": ".ganti-orbit3.jpg (reply/kirim gambar)",
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
