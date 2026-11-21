// Fitur owner/ganti-xorizn-winner — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-xorizn-winner", {
  "name": "ganti-xorizn-winner.jpg",
  "command": [
    "ganti-xorizn-winner.jpg",
    "gantixoriznwinner",
    "setxoriznwinner"
  ],
  "category": "owner",
  "desc": "Ganti gambar xorizn-winner.jpg (thumbnail game winner)",
  "usage": ".ganti-xorizn-winner.jpg (reply/kirim gambar)",
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
