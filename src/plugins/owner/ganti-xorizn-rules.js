// Fitur owner/ganti-xorizn-rules — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-xorizn-rules", {
  "name": "ganti-xorizn-rules.jpg",
  "command": [
    "ganti-xorizn-rules.jpg",
    "gantirules",
    "setxoriznrules"
  ],
  "category": "owner",
  "desc": "Ganti gambar xorizn-rules.jpg (thumbnail rules)",
  "usage": ".ganti-xorizn-rules.jpg (reply/kirim gambar)",
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
