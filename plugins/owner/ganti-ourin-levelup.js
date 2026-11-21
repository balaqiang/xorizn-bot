// Fitur owner/ganti-ourin-levelup — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-ourin-levelup", {
  "name": "ganti-ourin-levelup.jpg",
  "command": [
    "ganti-ourin-levelup.jpg",
    "gantiourinlevelup",
    "setourinlevelup"
  ],
  "category": "owner",
  "desc": "Ganti gambar ourin-levelup.jpg",
  "usage": ".ganti-ourin-levelup.jpg (reply/kirim gambar)",
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
