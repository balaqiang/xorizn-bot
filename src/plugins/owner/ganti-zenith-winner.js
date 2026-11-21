// Fitur owner/ganti-zenith-winner — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ganti-zenith-winner", {
  "name": "ganti-zenith-winner.jpg",
  "command": [
    "ganti-zenith-winner.jpg",
    "gantizenithwinner",
    "setzenithwinner"
  ],
  "category": "owner",
  "desc": "Ganti gambar zenith-winner.jpg (thumbnail game winner)",
  "usage": ".ganti-zenith-winner.jpg (reply/kirim gambar)",
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
