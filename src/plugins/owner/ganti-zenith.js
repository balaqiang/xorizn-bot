// Fitur owner/ganti-zenith — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ganti-zenith", {
  "name": "ganti-zenith.jpg",
  "command": [
    "ganti-zenith.jpg",
    "gantizenith",
    "setzenith"
  ],
  "category": "owner",
  "desc": "Ganti gambar zenith.jpg (thumbnail menu)",
  "usage": ".ganti-zenith.jpg (reply/kirim gambar)",
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
