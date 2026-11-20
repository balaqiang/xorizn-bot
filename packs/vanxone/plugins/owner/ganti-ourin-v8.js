// Fitur owner/ganti-ourin-v8 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-ourin-v8", {
  "name": "ganti-ourin-v8.jpg",
  "command": [
    "ganti-ourin-v8.jpg",
    "gantiourinv8",
    "setourinv8"
  ],
  "category": "owner",
  "desc": "Ganti gambar ourin-v8.jpg (thumbnail welcome)",
  "usage": ".ganti-ourin-v8.jpg (reply/kirim gambar)",
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
