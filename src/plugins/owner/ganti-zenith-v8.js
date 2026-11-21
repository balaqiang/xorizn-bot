// Fitur owner/ganti-zenith-v8 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ganti-zenith-v8", {
  "name": "ganti-zenith-v8.jpg",
  "command": [
    "ganti-zenith-v8.jpg",
    "gantizenithv8",
    "setzenithv8"
  ],
  "category": "owner",
  "desc": "Ganti gambar zenith-v8.jpg (thumbnail welcome)",
  "usage": ".ganti-zenith-v8.jpg (reply/kirim gambar)",
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
