// Fitur owner/ganti-rimuru-demote — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ganti-rimuru-demote", {
  "name": "ganti-rimuru-demote.jpg",
  "command": [
    "ganti-rimuru-demote.jpg",
    "gantirimurudemote",
    "setrimurudemote"
  ],
  "category": "owner",
  "desc": "Ganti gambar rimuru-demote.jpg",
  "usage": ".ganti-rimuru-demote.jpg (reply/kirim gambar)",
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
