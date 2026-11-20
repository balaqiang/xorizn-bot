// Fitur owner/ganti-rimuru2 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ganti-rimuru2", {
  "name": "ganti-rimuru2.jpg",
  "command": [
    "ganti-rimuru2.jpg",
    "gantirimuru2",
    "setrimuru2"
  ],
  "category": "owner",
  "desc": "Ganti gambar rimuru2.jpg",
  "usage": ".ganti-rimuru2.jpg (reply/kirim gambar)",
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
