// Fitur owner/ganti-zenith3 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ganti-zenith3", {
  "name": "ganti-zenith3.jpg",
  "command": [
    "ganti-zenith3.jpg",
    "gantizenith3",
    "setzenith3"
  ],
  "category": "owner",
  "desc": "Ganti gambar zenith3.jpg",
  "usage": ".ganti-zenith3.jpg (reply/kirim gambar)",
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
