// Fitur owner/ganti-vemzo-levelup — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("owner/ganti-vemzo-levelup", {
  "name": "ganti-vemzo-levelup.jpg",
  "command": [
    "ganti-vemzo-levelup.jpg",
    "gantivemzolevelup",
    "setvemzolevelup"
  ],
  "category": "owner",
  "desc": "Ganti gambar vemzo-levelup.jpg",
  "usage": ".ganti-vemzo-levelup.jpg (reply/kirim gambar)",
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
