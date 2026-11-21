// Fitur owner/ganti-xorizn — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-xorizn", {
  "name": "ganti-xorizn.jpg",
  "command": [
    "ganti-xorizn.jpg",
    "gantixorizn",
    "setxorizn"
  ],
  "category": "owner",
  "desc": "Ganti gambar xorizn.jpg (thumbnail menu)",
  "usage": ".ganti-xorizn.jpg (reply/kirim gambar)",
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
