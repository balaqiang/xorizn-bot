// Fitur owner/ganti-zenith-levelup — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ganti-zenith-levelup", {
  "name": "ganti-zenith-levelup.jpg",
  "command": [
    "ganti-zenith-levelup.jpg",
    "gantizenithlevelup",
    "setzenithlevelup"
  ],
  "category": "owner",
  "desc": "Ganti gambar zenith-levelup.jpg",
  "usage": ".ganti-zenith-levelup.jpg (reply/kirim gambar)",
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
