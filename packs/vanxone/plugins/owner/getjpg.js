// Fitur owner/getjpg — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/getjpg", {
  "name": "getjpg",
  "command": [
    "getjpg",
    "lihatjpg",
    "showjpg"
  ],
  "category": "owner",
  "desc": "Ambil gambar dari folder assets/images",
  "usage": ".getjpg <nama_file.jpg>",
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
