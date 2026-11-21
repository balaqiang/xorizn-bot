// Fitur owner/ganti-xorizn-welcome — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-xorizn-welcome", {
  "name": "ganti-xorizn-welcome.jpg",
  "command": [
    "ganti-xorizn-welcome.jpg",
    "gantiwelcome",
    "setxoriznwelcome"
  ],
  "category": "owner",
  "desc": "Ganti gambar xorizn-welcome.jpg (thumbnail welcome)",
  "usage": ".ganti-xorizn-welcome.jpg (reply/kirim gambar)",
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
