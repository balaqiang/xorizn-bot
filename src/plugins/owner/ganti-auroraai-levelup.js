// Fitur owner/ganti-auroraai-levelup — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-auroraai-levelup", {
  "name": "ganti-auroraai-levelup.jpg",
  "command": [
    "ganti-auroraai-levelup.jpg",
    "gantiauroraailevelup",
    "setauroraailevelup"
  ],
  "category": "owner",
  "desc": "Ganti gambar auroraai-levelup.jpg",
  "usage": ".ganti-auroraai-levelup.jpg (reply/kirim gambar atau URL)",
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
