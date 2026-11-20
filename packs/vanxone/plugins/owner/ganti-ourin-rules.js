// Fitur owner/ganti-ourin-rules — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-ourin-rules", {
  "name": "ganti-ourin-rules.jpg",
  "command": [
    "ganti-ourin-rules.jpg",
    "gantirules",
    "setourinrules"
  ],
  "category": "owner",
  "desc": "Ganti gambar ourin-rules.jpg (thumbnail rules)",
  "usage": ".ganti-ourin-rules.jpg (reply/kirim gambar)",
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
