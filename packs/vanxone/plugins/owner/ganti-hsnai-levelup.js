// Fitur owner/ganti-hsnai-levelup — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-hsnai-levelup", {
  "name": "ganti-hsnai-levelup.jpg",
  "command": [
    "ganti-hsnai-levelup.jpg",
    "gantihsnailevelup",
    "sethsnailevelup"
  ],
  "category": "owner",
  "desc": "Ganti gambar hsnai-levelup.jpg",
  "usage": ".ganti-hsnai-levelup.jpg (reply/kirim gambar atau URL)",
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
