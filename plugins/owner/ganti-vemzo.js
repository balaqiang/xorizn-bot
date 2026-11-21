// Fitur owner/ganti-vemzo — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("owner/ganti-vemzo", {
  "name": "ganti-vemzo.jpg",
  "command": [
    "ganti-vemzo.jpg",
    "gantivemzo",
    "setvemzo"
  ],
  "category": "owner",
  "desc": "Ganti gambar vemzo.jpg (thumbnail menu)",
  "usage": ".ganti-vemzo.jpg (reply/kirim gambar)",
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
