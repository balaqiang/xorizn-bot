// Fitur owner/ganti-vemzo-v8 — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("owner/ganti-vemzo-v8", {
  "name": "ganti-vemzo-v8.jpg",
  "command": [
    "ganti-vemzo-v8.jpg",
    "gantivemzov8",
    "setvemzov8"
  ],
  "category": "owner",
  "desc": "Ganti gambar vemzo-v8.jpg (thumbnail welcome)",
  "usage": ".ganti-vemzo-v8.jpg (reply/kirim gambar)",
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
