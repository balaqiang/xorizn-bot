// Fitur owner/ganti-orbit-v8 — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("owner/ganti-orbit-v8", {
  "name": "ganti-orbit-v8.jpg",
  "command": [
    "ganti-orbit-v8.jpg",
    "gantiorbitv8",
    "setorbitv8"
  ],
  "category": "owner",
  "desc": "Ganti gambar orbit-v8.jpg (thumbnail welcome)",
  "usage": ".ganti-orbit-v8.jpg (reply/kirim gambar)",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
