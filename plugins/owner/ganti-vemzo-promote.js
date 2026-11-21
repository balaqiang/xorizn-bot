// Fitur owner/ganti-vemzo-promote — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("owner/ganti-vemzo-promote", {
  "name": "ganti-vemzo-promote.jpg",
  "command": [
    "ganti-vemzo-promote.jpg",
    "gantivemzopromote",
    "setvemzopromote"
  ],
  "category": "owner",
  "desc": "Ganti gambar vemzo-promote.jpg",
  "usage": ".ganti-vemzo-promote.jpg (reply/kirim gambar)",
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
