// Fitur owner/ganti-xorizn-goodbye — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-xorizn-goodbye", {
  "name": "ganti-xorizn-goodbye.jpg",
  "command": [
    "ganti-xorizn-goodbye.jpg",
    "gantigoodbye",
    "setxorizngoodbye"
  ],
  "category": "owner",
  "desc": "Ganti gambar xorizn-goodbye.jpg (thumbnail goodbye)",
  "usage": ".ganti-xorizn-goodbye.jpg (reply/kirim gambar)",
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
