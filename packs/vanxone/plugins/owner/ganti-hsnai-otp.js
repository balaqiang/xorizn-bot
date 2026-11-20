// Fitur owner/ganti-hsnai-otp — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-hsnai-otp", {
  "name": "ganti-hsnai-otp.jpg",
  "command": [
    "ganti-hsnai-otp.jpg",
    "gantihsnaiotp",
    "sethsnaiotp"
  ],
  "category": "owner",
  "desc": "Ganti gambar hsnai-otp.jpg",
  "usage": ".ganti-hsnai-otp.jpg (reply/kirim gambar atau URL)",
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
