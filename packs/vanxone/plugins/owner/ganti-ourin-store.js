// Fitur owner/ganti-ourin-store — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-ourin-store", {
  "name": "ganti-ourin-store.jpg",
  "command": [
    "ganti-ourin-store.jpg",
    "gantistore",
    "setourinstore"
  ],
  "category": "owner",
  "desc": "Ganti gambar ourin-store.jpg (thumbnail store)",
  "usage": ".ganti-ourin-store.jpg (reply/kirim gambar)",
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
