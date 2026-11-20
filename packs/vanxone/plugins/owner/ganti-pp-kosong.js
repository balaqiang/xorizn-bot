// Fitur owner/ganti-pp-kosong — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-pp-kosong", {
  "name": "ganti-pp-kosong.jpg",
  "command": [
    "ganti-pp-kosong.jpg",
    "gantippkosong",
    "setppkosong"
  ],
  "category": "owner",
  "desc": "Ganti gambar pp-kosong.jpg",
  "usage": ".ganti-pp-kosong.jpg (reply/kirim gambar)",
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
