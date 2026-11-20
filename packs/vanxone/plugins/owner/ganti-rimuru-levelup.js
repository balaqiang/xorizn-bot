// Fitur owner/ganti-rimuru-levelup — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ganti-rimuru-levelup", {
  "name": "ganti-rimuru-levelup.jpg",
  "command": [
    "ganti-rimuru-levelup.jpg",
    "gantirimurulevelup",
    "setrimurulevelup"
  ],
  "category": "owner",
  "desc": "Ganti gambar rimuru-levelup.jpg",
  "usage": ".ganti-rimuru-levelup.jpg (reply/kirim gambar)",
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
