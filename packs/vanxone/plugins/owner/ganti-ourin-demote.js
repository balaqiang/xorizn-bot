// Fitur owner/ganti-ourin-demote — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-ourin-demote", {
  "name": "ganti-ourin-demote.jpg",
  "command": [
    "ganti-ourin-demote.jpg",
    "gantiourindemote",
    "setourindemote"
  ],
  "category": "owner",
  "desc": "Ganti gambar ourin-demote.jpg",
  "usage": ".ganti-ourin-demote.jpg (reply/kirim gambar)",
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
