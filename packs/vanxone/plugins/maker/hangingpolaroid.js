// Fitur maker/hangingpolaroid — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/hangingpolaroid", {
  "name": "hangingpolaroid",
  "command": [
    "hangingpolaroid",
    "polaroid2",
    "pola",
    "bingkai",
    "frame"
  ],
  "category": "maker",
  "desc": "Membuat foto bingkai Polaroid gantung yang otomatis menyesuaikan ukuran foto asli (Responsive pure SVG)",
  "usage": ".pola (Kirim/Reply Foto)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
