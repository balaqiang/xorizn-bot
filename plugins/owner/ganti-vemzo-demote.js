// Fitur owner/ganti-vemzo-demote — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("owner/ganti-vemzo-demote", {
  "name": "ganti-vemzo-demote.jpg",
  "command": [
    "ganti-vemzo-demote.jpg",
    "gantivemzodemote",
    "setvemzodemote"
  ],
  "category": "owner",
  "desc": "Ganti gambar vemzo-demote.jpg",
  "usage": ".ganti-vemzo-demote.jpg (reply/kirim gambar)",
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
