// Fitur owner/ganti-rimuru-winner — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ganti-rimuru-winner", {
  "name": "ganti-rimuru-winner.jpg",
  "command": [
    "ganti-rimuru-winner.jpg",
    "gantirimuruwinner",
    "setrimuruwinner"
  ],
  "category": "owner",
  "desc": "Ganti gambar rimuru-winner.jpg (thumbnail game winner)",
  "usage": ".ganti-rimuru-winner.jpg (reply/kirim gambar)",
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
