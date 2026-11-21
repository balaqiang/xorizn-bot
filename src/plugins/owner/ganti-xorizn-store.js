// Fitur owner/ganti-xorizn-store — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-xorizn-store", {
  "name": "ganti-xorizn-store.jpg",
  "command": [
    "ganti-xorizn-store.jpg",
    "gantistore",
    "setxoriznstore"
  ],
  "category": "owner",
  "desc": "Ganti gambar xorizn-store.jpg (thumbnail store)",
  "usage": ".ganti-xorizn-store.jpg (reply/kirim gambar)",
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
