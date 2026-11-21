// Fitur owner/ganti-auroraai-promote — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-auroraai-promote", {
  "name": "ganti-auroraai-promote.jpg",
  "command": [
    "ganti-auroraai-promote.jpg",
    "gantiauroraaipromote",
    "setauroraaipromote"
  ],
  "category": "owner",
  "desc": "Ganti gambar auroraai-promote.jpg",
  "usage": ".ganti-auroraai-promote.jpg (reply/kirim gambar atau URL)",
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
