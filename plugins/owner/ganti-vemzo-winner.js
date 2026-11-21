// Fitur owner/ganti-vemzo-winner — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("owner/ganti-vemzo-winner", {
  "name": "ganti-vemzo-winner.jpg",
  "command": [
    "ganti-vemzo-winner.jpg",
    "gantivemzowinner",
    "setvemzowinner"
  ],
  "category": "owner",
  "desc": "Ganti gambar vemzo-winner.jpg (thumbnail game winner)",
  "usage": ".ganti-vemzo-winner.jpg (reply/kirim gambar)",
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
