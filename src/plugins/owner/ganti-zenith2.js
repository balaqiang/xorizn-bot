// Fitur owner/ganti-zenith2 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ganti-zenith2", {
  "name": "ganti-zenith2.jpg",
  "command": [
    "ganti-zenith2.jpg",
    "gantizenith2",
    "setzenith2"
  ],
  "category": "owner",
  "desc": "Ganti gambar zenith2.jpg",
  "usage": ".ganti-zenith2.jpg (reply/kirim gambar)",
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
