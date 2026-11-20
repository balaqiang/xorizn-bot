// Fitur owner/ganti-rimuru-v8 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ganti-rimuru-v8", {
  "name": "ganti-rimuru-v8.jpg",
  "command": [
    "ganti-rimuru-v8.jpg",
    "gantirimuruv8",
    "setrimuruv8"
  ],
  "category": "owner",
  "desc": "Ganti gambar rimuru-v8.jpg (thumbnail welcome)",
  "usage": ".ganti-rimuru-v8.jpg (reply/kirim gambar)",
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
