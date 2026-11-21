// Fitur owner/ganti-orbit-levelup — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("owner/ganti-orbit-levelup", {
  "name": "ganti-orbit-levelup.jpg",
  "command": [
    "ganti-orbit-levelup.jpg",
    "gantiorbitlevelup",
    "setorbitlevelup"
  ],
  "category": "owner",
  "desc": "Ganti gambar orbit-levelup.jpg",
  "usage": ".ganti-orbit-levelup.jpg (reply/kirim gambar)",
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
