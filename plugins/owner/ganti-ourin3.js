// Fitur owner/ganti-ourin3 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-ourin3", {
  "name": "ganti-ourin3.jpg",
  "command": [
    "ganti-ourin3.jpg",
    "gantiourin3",
    "setourin3"
  ],
  "category": "owner",
  "desc": "Ganti gambar ourin3.jpg",
  "usage": ".ganti-ourin3.jpg (reply/kirim gambar)",
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
