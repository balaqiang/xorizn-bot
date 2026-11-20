// Fitur owner/ganti-rimuru — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ganti-rimuru", {
  "name": "ganti-rimuru.jpg",
  "command": [
    "ganti-rimuru.jpg",
    "gantirimuru",
    "setrimuru"
  ],
  "category": "owner",
  "desc": "Ganti gambar rimuru.jpg (thumbnail menu)",
  "usage": ".ganti-rimuru.jpg (reply/kirim gambar)",
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
