// Fitur owner/addjpg — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/addjpg", {
  "name": "addjpg",
  "command": [
    "addjpg",
    "addimage",
    "tambahjpg",
    "setjpg"
  ],
  "category": "owner",
  "desc": "Tambah gambar baru ke folder assets/images",
  "usage": ".addjpg <nama_file.jpg> (reply gambar)",
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
