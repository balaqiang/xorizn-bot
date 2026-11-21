// Fitur owner/ganti-ourin2 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-ourin2", {
  "name": "ganti-ourin2.jpg",
  "command": [
    "ganti-ourin2.jpg",
    "gantiourin2",
    "setourin2"
  ],
  "category": "owner",
  "desc": "Ganti gambar ourin2.jpg",
  "usage": ".ganti-ourin2.jpg (reply/kirim gambar)",
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
