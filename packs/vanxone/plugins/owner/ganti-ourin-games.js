// Fitur owner/ganti-ourin-games — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-ourin-games", {
  "name": "ganti-ourin-games.jpg",
  "command": [
    "ganti-ourin-games.jpg",
    "gantigames",
    "setouringames"
  ],
  "category": "owner",
  "desc": "Ganti gambar ourin-games.jpg (thumbnail games)",
  "usage": ".ganti-ourin-games.jpg (reply/kirim gambar)",
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
