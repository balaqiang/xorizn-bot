// Fitur owner/ganti-ourin-goodbye — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-ourin-goodbye", {
  "name": "ganti-ourin-goodbye.jpg",
  "command": [
    "ganti-ourin-goodbye.jpg",
    "gantigoodbye",
    "setouringoodbye"
  ],
  "category": "owner",
  "desc": "Ganti gambar ourin-goodbye.jpg (thumbnail goodbye)",
  "usage": ".ganti-ourin-goodbye.jpg (reply/kirim gambar)",
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
