// Fitur owner/ganti-xorizn-games — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-xorizn-games", {
  "name": "ganti-xorizn-games.jpg",
  "command": [
    "ganti-xorizn-games.jpg",
    "gantigames",
    "setxorizngames"
  ],
  "category": "owner",
  "desc": "Ganti gambar xorizn-games.jpg (thumbnail games)",
  "usage": ".ganti-xorizn-games.jpg (reply/kirim gambar)",
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
