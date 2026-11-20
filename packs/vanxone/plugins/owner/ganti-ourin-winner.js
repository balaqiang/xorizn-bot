// Fitur owner/ganti-ourin-winner — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-ourin-winner", {
  "name": "ganti-ourin-winner.jpg",
  "command": [
    "ganti-ourin-winner.jpg",
    "gantiourinwinner",
    "setourinwinner"
  ],
  "category": "owner",
  "desc": "Ganti gambar ourin-winner.jpg (thumbnail game winner)",
  "usage": ".ganti-ourin-winner.jpg (reply/kirim gambar)",
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
