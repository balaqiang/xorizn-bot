// Fitur owner/gantizannjpg — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/gantizannjpg", {
  "name": "ganti-zann.jpg",
  "command": [
    "ganti-zann.jpg",
    "ganzann",
    "setzann"
  ],
  "category": "owner",
  "desc": "Ganti gambar Zann.jpg (thumbnail menu)",
  "usage": ".ganti-zann.jpg (reply/kirim gambar)",
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
