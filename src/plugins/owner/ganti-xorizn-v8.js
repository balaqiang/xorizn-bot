// Fitur owner/ganti-xorizn-v8 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-xorizn-v8", {
  "name": "ganti-xorizn-v8.jpg",
  "command": [
    "ganti-xorizn-v8.jpg",
    "gantixoriznv8",
    "setxoriznv8"
  ],
  "category": "owner",
  "desc": "Ganti gambar xorizn-v8.jpg (thumbnail welcome)",
  "usage": ".ganti-xorizn-v8.jpg (reply/kirim gambar)",
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
