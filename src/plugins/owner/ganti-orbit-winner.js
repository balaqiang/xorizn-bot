// Fitur owner/ganti-orbit-winner — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("owner/ganti-orbit-winner", {
  "name": "ganti-orbit-winner.jpg",
  "command": [
    "ganti-orbit-winner.jpg",
    "gantiorbitwinner",
    "setorbitwinner"
  ],
  "category": "owner",
  "desc": "Ganti gambar orbit-winner.jpg (thumbnail game winner)",
  "usage": ".ganti-orbit-winner.jpg (reply/kirim gambar)",
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
