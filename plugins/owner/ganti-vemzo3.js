// Fitur owner/ganti-vemzo3 — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("owner/ganti-vemzo3", {
  "name": "ganti-vemzo3.jpg",
  "command": [
    "ganti-vemzo3.jpg",
    "gantivemzo3",
    "setvemzo3"
  ],
  "category": "owner",
  "desc": "Ganti gambar vemzo3.jpg",
  "usage": ".ganti-vemzo3.jpg (reply/kirim gambar)",
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
