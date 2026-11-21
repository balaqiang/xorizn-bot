// Fitur owner/ganti-auroraai — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-auroraai", {
  "name": "ganti-auroraai.jpg",
  "command": [
    "ganti-auroraai.jpg",
    "gantiauroraai",
    "setauroraai"
  ],
  "category": "owner",
  "desc": "Ganti gambar auroraai.jpg (thumbnail menu)",
  "usage": ".ganti-auroraai.jpg (reply/kirim gambar atau URL)",
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
