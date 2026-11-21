// Fitur owner/ganti-orbit-demote — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("owner/ganti-orbit-demote", {
  "name": "ganti-orbit-demote.jpg",
  "command": [
    "ganti-orbit-demote.jpg",
    "gantiorbitdemote",
    "setorbitdemote"
  ],
  "category": "owner",
  "desc": "Ganti gambar orbit-demote.jpg",
  "usage": ".ganti-orbit-demote.jpg (reply/kirim gambar)",
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
