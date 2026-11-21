// Fitur owner/ganti-zenith-promote — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ganti-zenith-promote", {
  "name": "ganti-zenith-promote.jpg",
  "command": [
    "ganti-zenith-promote.jpg",
    "gantizenithpromote",
    "setzenithpromote"
  ],
  "category": "owner",
  "desc": "Ganti gambar zenith-promote.jpg",
  "usage": ".ganti-zenith-promote.jpg (reply/kirim gambar)",
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
