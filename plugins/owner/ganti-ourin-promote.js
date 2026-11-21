// Fitur owner/ganti-ourin-promote — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-ourin-promote", {
  "name": "ganti-ourin-promote.jpg",
  "command": [
    "ganti-ourin-promote.jpg",
    "gantiourinpromote",
    "setourinpromote"
  ],
  "category": "owner",
  "desc": "Ganti gambar ourin-promote.jpg",
  "usage": ".ganti-ourin-promote.jpg (reply/kirim gambar)",
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
