// Fitur owner/ganti-auroraai-otp — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-auroraai-otp", {
  "name": "ganti-auroraai-otp.jpg",
  "command": [
    "ganti-auroraai-otp.jpg",
    "gantiauroraaiotp",
    "setauroraaiotp"
  ],
  "category": "owner",
  "desc": "Ganti gambar auroraai-otp.jpg",
  "usage": ".ganti-auroraai-otp.jpg (reply/kirim gambar atau URL)",
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
