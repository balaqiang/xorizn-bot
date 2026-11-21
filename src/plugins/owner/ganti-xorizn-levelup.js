// Fitur owner/ganti-xorizn-levelup — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-xorizn-levelup", {
  "name": "ganti-xorizn-levelup.jpg",
  "command": [
    "ganti-xorizn-levelup.jpg",
    "gantixoriznlevelup",
    "setxoriznlevelup"
  ],
  "category": "owner",
  "desc": "Ganti gambar xorizn-levelup.jpg",
  "usage": ".ganti-xorizn-levelup.jpg (reply/kirim gambar)",
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
