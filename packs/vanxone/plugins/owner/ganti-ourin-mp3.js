// Fitur owner/ganti-ourin-mp3 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-ourin-mp3", {
  "name": "ganti-ourin.mp3",
  "command": [
    "ganti-ourin.mp3",
    "gantiourinaudio",
    "setourinaudio"
  ],
  "category": "owner",
  "desc": "Ganti audio ourin.mp3",
  "usage": ".ganti-ourin.mp3 (reply/kirim audio)",
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
