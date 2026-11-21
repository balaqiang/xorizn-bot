// Fitur owner/ganti-orbit-promote — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("owner/ganti-orbit-promote", {
  "name": "ganti-orbit-promote.jpg",
  "command": [
    "ganti-orbit-promote.jpg",
    "gantiorbitpromote",
    "setorbitpromote"
  ],
  "category": "owner",
  "desc": "Ganti gambar orbit-promote.jpg",
  "usage": ".ganti-orbit-promote.jpg (reply/kirim gambar)",
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
