// Fitur owner/ganti-rimuru3 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ganti-rimuru3", {
  "name": "ganti-rimuru3.jpg",
  "command": [
    "ganti-rimuru3.jpg",
    "gantirimuru3",
    "setrimuru3"
  ],
  "category": "owner",
  "desc": "Ganti gambar rimuru3.jpg",
  "usage": ".ganti-rimuru3.jpg (reply/kirim gambar)",
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
