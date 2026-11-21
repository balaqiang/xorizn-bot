// Fitur owner/ganti-xorizn2 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-xorizn2", {
  "name": "ganti-xorizn2.jpg",
  "command": [
    "ganti-xorizn2.jpg",
    "gantixorizn2",
    "setxorizn2"
  ],
  "category": "owner",
  "desc": "Ganti gambar xorizn2.jpg",
  "usage": ".ganti-xorizn2.jpg (reply/kirim gambar)",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
