// Fitur owner/ganti-ourin — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-ourin", {
  "name": "ganti-ourin.jpg",
  "command": [
    "ganti-ourin.jpg",
    "gantiourin",
    "setourin"
  ],
  "category": "owner",
  "desc": "Ganti gambar ourin.jpg (thumbnail menu)",
  "usage": ".ganti-ourin.jpg (reply/kirim gambar)",
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
