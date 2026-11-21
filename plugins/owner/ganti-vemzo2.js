// Fitur owner/ganti-vemzo2 — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("owner/ganti-vemzo2", {
  "name": "ganti-vemzo2.jpg",
  "command": [
    "ganti-vemzo2.jpg",
    "gantivemzo2",
    "setvemzo2"
  ],
  "category": "owner",
  "desc": "Ganti gambar vemzo2.jpg",
  "usage": ".ganti-vemzo2.jpg (reply/kirim gambar)",
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
