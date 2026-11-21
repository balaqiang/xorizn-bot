// Fitur owner/ganti-ourin-welcome — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-ourin-welcome", {
  "name": "ganti-ourin-welcome.jpg",
  "command": [
    "ganti-ourin-welcome.jpg",
    "gantiwelcome",
    "setourinwelcome"
  ],
  "category": "owner",
  "desc": "Ganti gambar ourin-welcome.jpg (thumbnail welcome)",
  "usage": ".ganti-ourin-welcome.jpg (reply/kirim gambar)",
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
