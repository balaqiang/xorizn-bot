// Fitur owner/ganti-zenith-demote — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ganti-zenith-demote", {
  "name": "ganti-zenith-demote.jpg",
  "command": [
    "ganti-zenith-demote.jpg",
    "gantizenithdemote",
    "setzenithdemote"
  ],
  "category": "owner",
  "desc": "Ganti gambar zenith-demote.jpg",
  "usage": ".ganti-zenith-demote.jpg (reply/kirim gambar)",
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
